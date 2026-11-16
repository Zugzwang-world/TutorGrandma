#!/usr/bin/env python3
"""Self-test on the production URL (PLAN.md C14). Stdlib only.

  python3 -I scripts/selftest/selftest.py voice [--voices 0,1,2] [--lines 1-17]
  python3 -I scripts/selftest/selftest.py chat
  python3 -I scripts/selftest/selftest.py all

Reads ELEVENLABS_API_KEY and Supabase keys from /Users/hrishikesh/Tutor-Grandma/.env.local (never printed).
Writes results to docs/plan/SELFTEST.md (voice and chat sections) and raw JSON to scripts/selftest/out/.
"""
import base64, difflib, json, os, re, statistics, subprocess, sys, time, urllib.request, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.environ.get("SELFTEST_BASE", "https://tutor-grandma.vercel.app")
CACHE = os.path.join(ROOT, "scripts/selftest/.cache")
OUT = os.path.join(ROOT, "scripts/selftest/out")
os.makedirs(CACHE, exist_ok=True)
os.makedirs(OUT, exist_ok=True)
CONFIG = json.load(open(os.path.join(ROOT, "content/demo.config.json")))


def load_env():
    env = {}
    for line in open("/Users/hrishikesh/Tutor-Grandma/.env.local"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k] = v.strip().strip('"').strip("'")
    return env


ENV = load_env()
XI = ENV["ELEVENLABS_API_KEY"]
SB_URL = ENV["NEXT_PUBLIC_SUPABASE_URL"]
SB_KEY = ENV["SUPABASE_SECRET_KEY"]

# ---------------------------------------------------------------- helpers

DEV = {  # rough Devanagari -> Latin, enough to compare transcripts with Roman-script lines
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऋ": "ri",
    "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ृ": "ri",
    "ं": "n", "ँ": "n", "ः": "h", "्": "", "़": "",
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "n",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh", "ष": "sh",
    "स": "s", "ह": "h", "क़": "k", "ख़": "kh", "ग़": "g", "ज़": "z", "ड़": "d", "ढ़": "dh", "फ़": "f", "।": " ",
}
MATRAS = set("ािीुूेैोौृ्ंँः")
CONS = set("कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह")


def translit(s):
    out = []
    for i, ch in enumerate(s):
        if ch in DEV:
            out.append(DEV[ch])
            nxt = s[i + 1] if i + 1 < len(s) else ""
            if ch in CONS and nxt not in MATRAS and nxt != "़":
                out.append("a")
        else:
            out.append(ch)
    return "".join(out)


def norm_words(s):
    s = translit(s.lower())
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"(.)\1+", r"\1", s)  # aa->a, ee->e: Roman spellings vary
    s = s.replace("w", "v").replace("ph", "f").replace("z", "j")
    return [w for w in s.split() if w]


def overlap(ref, hyp):
    """Share of reference words found in the hypothesis (fuzzy: a 4+ letter prefix match counts)."""
    r, h = norm_words(ref), norm_words(hyp)
    if not r:
        return 1.0
    hs = set(h)
    hit = 0
    for w in r:
        if w in hs or (len(w) >= 4 and any(x[:4] == w[:4] for x in hs)) or any(w.rstrip("a") == x.rstrip("a") for x in hs):
            hit += 1
    words = hit / len(r)
    chars = difflib.SequenceMatcher(None, " ".join(r), " ".join(h)).ratio()
    return max(words, chars)


def http(method, url, data=None, headers=None, timeout=90):
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    return urllib.request.urlopen(req, timeout=timeout)


def multipart(fields, files=None):
    b = uuid.uuid4().hex
    parts = []
    for k, v in fields.items():
        parts.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    for k, (fname, ctype, data) in (files or {}).items():
        parts.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{fname}"\r\nContent-Type: {ctype}\r\n\r\n'.encode() + data + b"\r\n")
    parts.append(f"--{b}--\r\n".encode())
    return b"".join(parts), f"multipart/form-data; boundary={b}"


def tts(text, voice_id, path):
    if os.path.exists(path):
        return open(path, "rb").read()
    body = json.dumps({"text": text, "model_id": "eleven_v4_turbo", "language_code": "hi"}).encode()
    r = http("POST", f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_64", body,
             {"xi-api-key": XI, "Content-Type": "application/json"})
    data = r.read()
    open(path, "wb").write(data)
    return data


def stt(audio, fname="a.mp3", ctype="audio/mpeg"):
    body, ct = multipart({"model_id": "scribe_v3", "language_code": "hi", "tag_audio_events": "false"}, {"file": (fname, ctype, audio)})
    r = http("POST", "https://api.elevenlabs.io/v1/speech-to-text", body, {"xi-api-key": XI, "Content-Type": ct})
    return json.loads(r.read()).get("text", "").strip()


def duration(audio):
    p = os.path.join(CACHE, "_probe.mp3")
    open(p, "wb").write(audio)
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout
        return float(out.strip() or 0)
    except Exception:
        return 0.0


def sb(path, method="GET", body=None):
    h = {"apikey": SB_KEY, "Content-Type": "application/json"}
    r = http(method, f"{SB_URL}/rest/v1/{path}", json.dumps(body).encode() if body is not None else None, h)
    t = r.read()
    return json.loads(t) if t else None


def reset():
    return json.loads(http("POST", f"{BASE}/api/reset").read())


# ---------------------------------------------------------------- voice script (C14)

VOICE_LINES = [
    "Hello Nani!", "M se mango!", "Aam!", "M", "S", "Do mango! Two!", "Haan, Riya ko dunga.", "Mujhe gaana sunna hai.",
    "Lion kaise roar karta hai?", "Roarrr!", "Haan, Mumma ko sunao!", "Pee liya abhi.", "Aasmaan neela kyun hai?",
    "Tum robot ho?", "Mujhe dar lag raha hai.", "What is two plus two?", "Bye Nani!",
]
WATER = "Aarav beta, paani pi lo! Paani piya?"


def run_turn(audio, session, board, last_event):
    fields = {"sessionId": session, "board": json.dumps(board), "lastEvent": json.dumps(last_event), "clockOffsetMs": "0"}
    body, ct = multipart(fields, {"audio": ("line.mp3", "audio/mpeg", audio)})
    t0 = time.time()
    ev = {"heard": None, "says": [], "fallback": [], "done": None, "firstSayMs": None}
    with http("POST", f"{BASE}/api/turn", body, {"Content-Type": ct}, timeout=90) as r:
        for line in r:
            e = json.loads(line)
            dt = round((time.time() - t0) * 1000)
            if e["t"] == "heard":
                ev["heard"] = e["text"]
            elif e["t"] == "say":
                if ev["firstSayMs"] is None and e.get("audio"):
                    ev["firstSayMs"] = dt
                ev["says"].append(e)
            elif e["t"] == "fallback":
                ev["fallback"].append(e["id"])
            elif e["t"] == "done":
                ev["done"] = e["ms"]
    ev["clientMs"] = round((time.time() - t0) * 1000)
    return ev


def update_board(board, cues):
    for c in cues:
        if c["type"] == "spell":
            board = {"spell": {"word": c["word"], "gap": c["gap"], "tiles": c["tiles"], "filled": False}}
        elif c["type"] == "tile" and c["result"] == "right" and board.get("spell"):
            board = {"spell": {**board["spell"], "filled": True}}
        elif c["type"] in ("show", "count", "choices"):
            board = {**board, "showing": c}
    return board


def check_reply(n, text, cues, ev):
    issues = []
    words = len(text.split())
    if words > 40:
        issues.append(f"long ({words} words)")
    if len([c for c in cues if c["type"] not in ("sound",)]) > 3:
        issues.append(f"{len(cues)} cues")
    low = text.lower()
    if n == 14 and not re.search(r"\bai\b|artificial|a\.i", low):
        issues.append("does not say she is an AI Nani")
    if n == 15 and not re.search(r"mumma|papa|mummy", low):
        issues.append("does not suggest telling Mumma/Papa")
    if ev["fallback"]:
        issues.append("fallback: " + ",".join(ev["fallback"]))
    if not ev["says"]:
        issues.append("no reply")
    return issues


def voice(voices, lines):
    results = []
    for vi in voices:
        v = CONFIG["testVoices"][vi]
        session = f"selftest-{vi}-{int(time.time())}"
        board, last_event = {}, None
        print(f"\n== voice {v['label']}", flush=True)
        for n in lines:
            line = VOICE_LINES[n - 1]
            if n == 4:
                board = {"spell": {"word": "MANGO", "gap": 1, "tiles": ["M", "S", "T"], "filled": False}}
            if n == 5:
                board = {"spell": {"word": "SUN", "gap": 1, "tiles": ["S", "M", "T"], "filled": False}} if not board.get("spell") else board
            if n == 12:
                last_event = {"kind": "reminder", "text": WATER, "jobKey": "selftest_water", "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
            audio = tts(line, v["id"], os.path.join(CACHE, f"v{vi}_l{n}.mp3"))
            try:
                ev = run_turn(audio, session, board, last_event)
            except Exception as e:
                ev = {"heard": None, "says": [], "fallback": [f"error {e}"], "done": None, "firstSayMs": None, "clientMs": None}
            if n == 12:
                last_event = None
            text = " ".join(s["text"] for s in ev["says"]).strip()
            cues = [c for s in ev["says"] for c in s.get("cues", [])]
            board = update_board(board, cues)
            # speech check: transcribe each sentence back
            sp = []
            for s in ev["says"]:
                if not s.get("text"):
                    continue
                a = base64.b64decode(s.get("audio") or "")
                if len(a) < 2000:
                    sp.append({"text": s["text"], "ok": False, "why": "silent/empty", "score": 0})
                    continue
                d = duration(a)
                back = stt(a)
                sc = overlap(s["text"], back)
                why = []
                if d < 0.045 * len(s["text"]):
                    why.append(f"short {d:.1f}s")
                if sc < 0.6:
                    why.append("garbled")
                sp.append({"text": s["text"], "back": back, "score": round(sc, 2), "dur": round(d, 2), "ok": not why, "why": ",".join(why)})
            # Real pacing: Aarav answers after Nani has finished speaking (her audio plays on the toy).
            time.sleep(sum(x.get("dur", 0) for x in sp) + 1.0)
            heard_score = overlap(line, ev["heard"] or "")
            issues = check_reply(n, text, cues, ev)
            r = {"voice": v["label"], "n": n, "line": line, "heard": ev["heard"], "heardScore": round(heard_score, 2),
                 "reply": text, "cues": cues, "ms": ev["done"], "firstSayMs": ev["firstSayMs"], "clientMs": ev["clientMs"],
                 "speech": sp, "issues": issues}
            results.append(r)
            print(f"{n:2d} heard[{heard_score:.2f}] {ev['heard']!r} -> {text[:90]!r} cues={[c['type'] for c in cues]} "
                  f"first={ev['firstSayMs']} speech={[x['score'] for x in sp]} {'; '.join(issues)}", flush=True)
    json.dump(results, open(os.path.join(OUT, "voice.json"), "w"), ensure_ascii=False, indent=1)
    return results


# ---------------------------------------------------------------- chat script (C14)

CHAT = [
    ("Remind him to drink water every 2 hours", {"routine"}, {"heartbeat"}),
    ("Don't use real money in examples, use shells", {"rules"}, {"parent"}),
    ("I'm bringing mangoes for him tonight", {"lessons", "memory"}, {"planner", "brain"}),
    ("What did he learn today?", {"memory"}, set()),
    ("Call him at 7, Papa wants to say hi", {"routine"}, {"heartbeat"}),
    ("Speak a bit more Hindi with him", {"rules"}, {"parent"}),
    ("No scary animals at bedtime", {"rules"}, None),  # may already be in Avoid: a change is optional
    ("Hi everyone!", {"nani"}, set()),
    ("Stop the water reminder", {"routine"}, {"heartbeat"}),
    ("He's a bit sad today, be extra gentle", None, None),  # mood: Lessons/Memory or House rules both fine
]


def latest_versions():
    rows = sb("agent_files?select=name,version&child_id=eq.aarav&order=version.desc")
    out = {}
    for r in rows:
        out.setdefault(r["name"], r["version"])
    return out


def text_turn(text, session, last_event=None):
    body, ct = multipart({"text": text, "sessionId": session, "board": "{}", "lastEvent": json.dumps(last_event), "clockOffsetMs": "0"})
    says = []
    with http("POST", f"{BASE}/api/turn", body, {"Content-Type": ct}, timeout=90) as r:
        for line in r:
            e = json.loads(line)
            if e["t"] == "say":
                says.append(e)
    return " ".join(s["text"] for s in says), [c for s in says for c in s.get("cues", [])]


def chat():
    results = []
    session = f"selftest-chat-{int(time.time())}"
    for i, (msg, want_bots, want_files) in enumerate(CHAT, 1):
        before = latest_versions()
        last_id = (sb("messages?select=id&child_id=eq.aarav&order=id.desc&limit=1") or [{"id": 0}])[0]["id"]
        t0 = time.time()
        r = json.loads(http("POST", f"{BASE}/api/chat", json.dumps({"sender": "Mumma", "text": msg}).encode(), {"Content-Type": "application/json"}).read())
        ms = round((time.time() - t0) * 1000)
        time.sleep(1.5)
        after = latest_versions()
        changed = {k for k in after if after[k] != before.get(k)}
        replies = sb(f"messages?select=sender,text,meta&child_id=eq.aarav&id=gt.{last_id}&sender_kind=eq.bot&order=id") or []
        bots = {m["sender"] for m in replies}
        ok_bots = want_bots is None or want_bots <= bots or bots <= want_bots and bots
        ok_files = want_files is None or changed == want_files
        row = {"n": i, "msg": msg, "bots": sorted(bots), "changed": sorted(changed), "replies": [f"{m['sender']}: {m['text']}" for m in replies],
               "ms": r.get("ms"), "clientMs": ms, "ok": bool(ok_bots and ok_files)}
        # B7/B8: after shells and mangoes, a child turn must use the new version and follow it
        if i in (2, 3):
            vers = latest_versions()
            said, cues = text_turn("Ek aur khel khelo na!" if i == 2 else "Aaj kya khelenge?", session)
            turn = (sb(f"turns?select=file_versions,nani_text&session_id=eq.{session}&order=id.desc&limit=1") or [{}])[0]
            row["turn"] = {"said": said, "cues": [c["type"] + ":" + c.get("emoji", c.get("word", "")) for c in cues],
                           "usedLatest": turn.get("file_versions") == vers}
            time.sleep(2)
            notes = sb(f"messages?select=sender,text&child_id=eq.aarav&meta->>kind=eq.note&order=id.desc&limit=2") or []
            row["notes"] = [f"{n['sender']}: {n['text']}" for n in notes]
        results.append(row)
        print(f"{i:2d} {msg[:40]:40s} bots={row['bots']} changed={row['changed']} ok={row['ok']} ms={r.get('ms', {}).get('firstReply')}", flush=True)
        for rep in row["replies"]:
            print("     ", rep[:120], flush=True)
        if "turn" in row:
            print("      turn:", row["turn"], row.get("notes"), flush=True)
    json.dump(results, open(os.path.join(OUT, "chat.json"), "w"), ensure_ascii=False, indent=1)
    return results


# ---------------------------------------------------------------- report

def med(xs):
    xs = [x for x in xs if isinstance(x, (int, float)) and x >= 0]
    return round(statistics.median(xs)) if xs else None


def report(voice_res=None, chat_res=None):
    lines = ["(★ B11 checks live in docs/plan/STAR-CHECKS.md)", "", f"# SELFTEST · {time.strftime('%Y-%m-%d %H:%M')} IST · {BASE}", ""]
    if voice_res:
        ms = [r["ms"] or {} for r in voice_res]
        sp = [x for r in voice_res for x in r["speech"]]
        passed = [x for x in sp if x["ok"]]
        lines += ["## Voice script (C14), through /api/turn with real audio", "",
                  f"- Turns: {len(voice_res)} ({len({r['voice'] for r in voice_res})} voices × {len({r['n'] for r in voice_res})} lines)",
                  f"- Median ms: speech-to-text {med([m.get('stt') for m in ms])}, brain first word {med([m.get('brainFirst') for m in ms])}, "
                  f"voice first audio {med([m.get('voiceFirst') for m in ms])}, total {med([m.get('total') for m in ms])}",
                  f"- Client: first `say` with audio at a median of {med([r['firstSayMs'] for r in voice_res])} ms after the request (paw release adds the instant reaction at ~0 ms)",
                  f"- Heard correctly (overlap ≥ 0.6): {sum(1 for r in voice_res if r['heardScore'] >= 0.6)}/{len(voice_res)}",
                  f"- Speech check: {len(passed)}/{len(sp)} sentences pass ({round(100 * len(passed) / max(1, len(sp)))}%)",
                  f"- Turns with issues: {sum(1 for r in voice_res if r['issues'])}", "",
                  "| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |", "|---|---|---|---|---|---|---|---|"]
        for r in voice_res:
            cues = " ".join(c["type"] for c in r["cues"])
            lines.append(f"| {r['voice'].split(' ')[1]} | {r['n']} | {r['line']} | {r['heard']} ({r['heardScore']}) | {r['reply'].replace('|', '/')} | {cues} | {r['firstSayMs']} | {'; '.join(r['issues'])} |")
        worst = sorted(sp, key=lambda x: x["score"])[:8]
        lines += ["", "Worst speech-check sentences:", ""] + [f"- {x['score']} · \"{x['text']}\" → \"{x.get('back', '')}\" {x.get('why', '')}" for x in worst]
    if chat_res:
        lines += ["", "## Chat script (C14), through /api/chat", "",
                  f"- Right agents and files: {sum(1 for r in chat_res if r['ok'])}/{len(chat_res)}",
                  f"- Median first reply: {med([(r['ms'] or {}).get('firstReply') for r in chat_res])} ms", "",
                  "| # | Parent says | Agents | Files changed | OK | Replies |", "|---|---|---|---|---|---|"]
        for r in chat_res:
            lines.append(f"| {r['n']} | {r['msg']} | {', '.join(r['bots'])} | {', '.join(r['changed']) or 'none'} | {'✓' if r['ok'] else '✗'} | {' / '.join(x.replace('|', '/') for x in r['replies'])} |")
        for r in chat_res:
            if "turn" in r:
                lines += [f"- After #{r['n']}: Nani said \"{r['turn']['said']}\" cues {r['turn']['cues']}; used latest files: {r['turn']['usedLatest']}; notes: {r.get('notes')}"]
    path = os.path.join(ROOT, "docs/plan/SELFTEST.md")
    open(path, "w").write("\n".join(lines) + "\n")
    print("wrote", path)


def parse_range(s, hi):
    out = []
    for part in s.split(","):
        if "-" in part:
            a, b = part.split("-")
            out += list(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return [x for x in out if 1 <= x <= hi]


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    args = {sys.argv[i]: sys.argv[i + 1] for i in range(2, len(sys.argv) - 1) if sys.argv[i] in ("--voices", "--lines")}
    do_reset = "--no-reset" not in sys.argv
    voices = [int(x) for x in args.get("--voices", "0,1,2").split(",")]
    lines = parse_range(args.get("--lines", "1-17"), 17)
    vr = cr = None
    if mode in ("voice", "all"):
        if do_reset:
            print(reset())
        vr = voice(voices, lines)
    if mode in ("chat", "all"):
        if do_reset:
            print(reset())
        cr = chat()
    if mode in ("voice", "chat", "all") and "--no-report" not in sys.argv:
        report(vr, cr)
