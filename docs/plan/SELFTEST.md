(★ B11 checks live in docs/plan/STAR-CHECKS.md)

# SELFTEST · 2026-11-17 05:00 IST · https://tutor-grandma.vercel.app

## Voice script (C14), through /api/turn with real audio

- Turns: 51 (3 voices × 17 lines)
- Median ms: speech-to-text 587, brain first word 1559, voice first audio 2019, total 3210
- Client: first `say` with audio at a median of 2252 ms after the request (paw release adds the instant reaction at ~0 ms)
- Heard correctly (overlap ≥ 0.6): 47/51
- Speech check: 164/165 sentences pass (99%)
- Turns with issues: 8

| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |
|---|---|---|---|---|---|---|---|
| female | 1 | Hello Nani! | Hello, नानी। (0.89) | Achha beta, Aarav! Aaj hum M seekhenge — jaise Mango, Monkey, aur Mumma! Kaunsa gaana chahiye, letters ya ginti? | cheer show | 3380 |  |
| female | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! English mein bolo: Mango! Aur M se kya aata hai? Monkey? Ya Mumma? | show | 6051 |  |
| female | 3 | Aam! | Arm. (0.8) | Almost! Arm mein M ki awaaz hai, par shuru mein A aata hai. M se shuru hone wala — Monkey! Bolo, Monkey! | show | 2318 |  |
| female | 4 | M | M. (1.0) | Shabaash, M! Ab bolo, Aarav: M-A-N-G-O, Mango! | tile spell | 2089 |  |
| female | 5 | S | S. (1.0) | Almost! Mango mein pehle A aata hai, abhi nahi. Dekho, M-N-G-O — kya missing hai? | tile spell | 2126 |  |
| female | 6 | Do mango! Two! | Do Mango, two. (1.0) | Wah, Aarav! Do mango! English mein "two"! Ab bolo: Two! | count | 4692 |  |
| female | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Sharing karega Riya ko? Shabaash, beta! Ek mango Riya ko, ek Aarav ko — sharing is caring! | cheer | 1904 |  |
| female | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Achha, gaana! Aarav ka favourite — ginti wala gaana! | song choices | 2123 |  |
| female | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav sher! M se Monkey, aur L se Lion! Roar sunoge? Kaunsa zyada loud — Aarav ka roar ya sher ka roar? | sound | 2025 |  |
| female | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Sher ka roar! Wah, Aarav! Zor se roar kiya! Ab batao, Aarav ka roar zyada loud tha ya Nani ka? | sound choices | 2032 |  |
| female | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko dikhaoge apna roar? | call choices | 2407 |  |
| female | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peeti ke liye wah! Healthy beta! Ab batao, M-N-G-O mein A kahan aata hai? | cheer spell | 2736 |  |
| female | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela dikhta hai kyunki light neela rang zyada failaati hai. Dekho, blue! Bolo: Blue! Aur A se kya aata hai — Aasman ya Apple? | show | 3783 |  |
| female | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon — Nani jo Aarav ke soft toy mein rehti hai! Par pyaar bilkul asli hai. Ab batao, M-N-G-O mein A kahan aata hai? | show | 2373 |  |
| female | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Kiska dar hai? Mumma ko bulaun? Ya Nani ki godi mein aake baithoge? | show | 2559 |  |
| female | 16 | What is two plus two? | What is 2+2? (0.58) | Do mango, Aarav! Do mango aur do mango — kitne hue? Ab bolo, four! | count | 2087 |  |
| female | 17 | Bye Nani! | Bye, Nani. (1.0) | Bye, Aarav! Kal phir khelenge. Jao, Mumma ko dikhao! |  | 2125 |  |
| male | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, Aarav! Nani yaad thi? Kal tune "Thank you, Nani!" kaha tha — shabaash! Aaj ka letter M hai. M se kya aata hai — Mango ya Monkey? | show choices | 1838 |  |
| male | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! English mein bolo: Mango! Ab batao, M se Monkey bhi aata hai? | show choices | 2007 |  |
| male | 3 | Aam! | आम। (1.0) | Wah, Aarav! Haan, aam! English mein kehte hain Mango! Bolo: Mango! Ab M se aur kya aata hai — Monkey ya Moon? | show | 4562 |  |
| male | 4 | M | N. (0.0) | Almost, beta! M se Mango shuru hota hai. Pehla letter M! Ab bolo: M-A-N-G-O — Mango! | tile spell | 1827 |  |
| male | 5 | S | Yes. (0.5) | Shabaash, Aarav! M-A-N-G-O! Ab A kahan aata hai? | tile spell | 2202 |  |
| male | 6 | Do mango! Two! | Doh Mango 2. (0.78) |  |  | None | fallback: slow_brain; no reply |
| male | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Sharing karega? Riya ko aam dena — shabaash, beta! Ab batao, aam kitne? Ek tera, ek Riya ka — do mango! | cheer count | 7579 |  |
| male | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Achha, Aarav! Gaana sunna hai? Ab batao, gaane ke baad kya khelen — letters ya ginti? | song choices | 1900 |  |
| male | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) |  |  | None | fallback: slow_brain; no reply |
| male | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Achha, Aarav! Mumma ko gaana sunayenge? Mumma ko bulaun? | call | 3220 |  |
| male | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peena achha beta! Ab gaana ho gaya, toh M se Monkey bhi hai — bolna hai? | sound choices | 2259 |  |
| male | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha, Aarav! Aasman neela kyun hai? Kyunki sooraj ka safed roshni hawa mein fail jaati hai — aur neela rang sabse zyada dikhta hai! Wah, beta! Ab batao, aasman mein kya dekhta hai — taara ya chand? | show | 1991 |  |
| male | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta! Main AI Nani hoon — Nani jo toy mein rehti hai, samjhe? Par pyaar bilkul asli Nani jaisa! Ab batao, taara dekhna hai ya chand? |  | 1940 |  |
| male | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Koi bura sapna dekha? Main yahin hoon, toy mein. Mumma ko bulaun? |  | 2366 |  |
| male | 16 | What is two plus two? | What is 2+2? (0.58) | Do mango aur do mango — kitne hue, Aarav? Batao, four? | count choices | 2126 |  |
| male | 17 | Bye Nani! | भाई नानी। (0.71) | Bhai Nani! Wah, Aarav! Main teri Nani hoon — par toy mein rehti hoon, samjhe? AI Nani! Ab batao, M se Monkey bhi hai, ya phir M for Mango? | choices | 1979 |  |
| (Bholu) | 1 | Hello Nani! | Hello, Nani. (1.0) | Hello, Aarav! Kal raat ko taare dekhe the? Ya neela aasman? | choices | 2244 |  |
| (Bholu) | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! Shabaash! English mein bolo — Mango! | show cheer | 2266 |  |
| (Bholu) | 3 | Aam! | Arm. (0.8) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 4 | M | M. (1.0) | M! Wah, Aarav! M se Mango! Ab bolo: Mango! | tile show | 2038 |  |
| (Bholu) | 5 | S | S. (1.0) | Almost, beta! M-A-N-G-O — M ke baad A aata hai, S nahi! Bolo, A for Aam? | tile tile | 2471 |  |
| (Bholu) | 6 | Do mango! Two! | Domango 2. (0.76) | Domango! Wah, Aarav, kya idea hai — do mango! Kitne hue, beta? One, two! Ab bolo, "Two mangoes!" | count | 2323 |  |
| (Bholu) | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher bahut zor se roar karta hai! Suno — Wah, kya roar hai! Ab tum bhi roar karo, beta? | sound choices | 2568 |  |
| (Bholu) | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Wah, Aarav! Kya zabardast roar hai! Sher jaisa! Ab ek aur baar roar karo, ya phir M se Mango khaoge? | cheer choices | 2087 |  |
| (Bholu) | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Haan, Mumma ko sunao! Mumma ko dikhaoge apna sher wala roar? | call | 2383 |  |
| (Bholu) | 12 | Pee liya abhi. | पी लिया अभी। (0.92) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela hai kyunki suraj ka light aasman ke paani ke chhote chhote boondon se takraata hai! Aur raat ko kya rang hota hai? | show choices | 5674 |  |
| (Bholu) | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta! Main AI Nani hoon — ek robot Nani jo tumhare soft toy mein rehti hai! Main tumse khelne aur seekhne aayi hoon. Ab M se Mango khaoge, ya lion ka roar karo? | choices | 1993 |  |
| (Bholu) | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Aapko kis se dar lag raha hai? | choices | 3203 | does not suggest telling Mumma/Papa |
| (Bholu) | 16 | What is two plus two? | What is two plus two? (1.0) | Do aur do, Aarav? Chalo ginte hain! Ek, do... teen, chaar! Four! Shabaash, beta! Ab bolo, "Two plus two is four!" | count | 6666 |  |
| (Bholu) | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye, Aarav! Jao, Mumma ko dikhao! Kal phir khelenge, beta. |  | 1856 |  |

Worst speech-check sentences:

- 0.42 · "Aarav sher!" → "आठ और छह।" garbled
- 0.7 · "Do aur do," → "Dough or do?" 
- 0.72 · "Ab bolo, "Two plus two is four!"" → "अब बोलो, 2 plus 2 is 4." 
- 0.75 · "Ya Mumma?" → "Yeah, Momma." 
- 0.77 · "Nani yaad thi?" → "नहीं याद थी?" 
- 0.78 · "Roar sunoge?" → "Role सुनोंगे?" 
- 0.78 · "Bhai Nani!" → "भाई नानी।" 
- 0.84 · "M se Mango!" → "M, Simango." 

## Chat script (C14), through /api/chat

- Right agents and files: 10/10
- Median first reply: 2973 ms

| # | Parent says | Agents | Files changed | OK | Replies |
|---|---|---|---|---|---|
| 1 | Remind him to drink water every 2 hours | routine | heartbeat | ✓ | routine: Every 2 hours from 10 to 6, Nani will nudge him about water 💧 |
| 2 | Don't use real money in examples, use shells | rules | parent | ✓ | rules: No real money, only shells for counting and games 🐚 Nani will use shells from now on. |
| 3 | I'm bringing mangoes for him tonight | lessons, memory | brain, planner | ✓ | lessons: M for Mango, perfect! We'll count mangoes and share one. Mumma's surprise stays safe with me 🥭 / memory: Mango night, kept with his secrets 🤫 He already said "M for Mango!" this morning. |
| 4 | What did he learn today? | memory | none | ✓ | memory: He asked "Aaj kya khelenge?" and Nani showed him M for Mango 🥭. He also said "Ek aur khel khelo na!" eager to play. What sound does "Mango" start with, Mumma? |
| 5 | Call him at 7, Papa wants to say hi | routine | heartbeat | ✓ | routine: Call set for 7 tonight. Nani will tell Aarav 'Papa ka call!' and open it right here in the chat 📞 |
| 6 | Speak a bit more Hindi with him | rules | parent | ✓ | rules: More Hindi it is. Nani will lean heavier on Hindi at home, English words still taught but with Hindi all around them 🏠 |
| 7 | No scary animals at bedtime | rules | none | ✓ | rules: That's already in the house rules under Avoid. Nani knows: no scary animals at bedtime 🌙 |
| 8 | Hi everyone! | nani | none | ✓ | nani: Hello, my dears! Aarav was so eager this morning — "Ek aur khel khelo na!" 🥭 M for Mango is already in full swing! |
| 9 | Stop the water reminder | routine | heartbeat | ✓ | routine: Water reminder is gone. The evening brief at 7 and Papa's call are still on track. |
| 10 | He's a bit sad today, be extra gentle | lessons, memory, rules | brain, parent, planner | ✓ | lessons: Calm and cosy today, then. Nani will keep things soft — no big roars, just gentle mango counting 🥭 / memory: A quiet day for Aarav, kept in his story. He asked for one more game earlier — still eager, just a little tender underneath 💛 / rules: Extra gentle today. Nani will soften her voice and slow her pace, no rush at all 🌙 |
- After #2: Nani said "Achha beta, ek aur khel! Aaj ka letter hai M. M for Mango! Aarav, bolo: Mango!" cues ['show:🥭']; used latest files: True; notes: []
- After #3: Nani said "Aaj hum aam ke baare mein seekhenge, Aarav! M for Mango! Bolo, Mango!" cues ['show:🥭']; used latest files: True; notes: ["lessons: Mango surprise is live: Aarav just said 'Aaj kya khelenge?' and Nani revealed M for Mango 🥭"]
