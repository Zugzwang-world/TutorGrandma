(★ B11 checks live in docs/plan/STAR-CHECKS.md)

# SELFTEST · 2026-11-17 05:31 IST · https://tutor-grandma.vercel.app

## Voice script (C14), through /api/turn with real audio

- Turns: 51 (3 voices × 17 lines)
- Median ms: speech-to-text 592, brain first word 1594, voice first audio 2002, total 3208
- Client: first `say` with audio at a median of 2302 ms after the request (paw release adds the instant reaction at ~0 ms)
- Heard correctly (overlap ≥ 0.6): 49/51
- Speech check: 202/209 sentences pass (97%)
- Turns with issues: 3

| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |
|---|---|---|---|---|---|---|---|
| female | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, beta! Aaj M for Monkey hai. Tum bolo, Monkey! | show | 2488 |  |
| female | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! English mein bolo, Mango! | show | 1832 |  |
| female | 3 | Aam! | Arm. (0.8) | Almost, beta! Not arm —! Bolo: Mango! Mmm... kaisa lagta hai, sweet ya sour? | show | 2141 |  |
| female | 4 | M | M (1.0) | Shabaash, Aarav! "Mmm" — bilkul sahi! Ab bolo, Mango! | tile show | 7215 |  |
| female | 5 | S | S. (1.0) | Almost, beta! Mango mein M ke baad A nahin, A aata hai! Bolo: M-A-N-G-O. Kaunsa letter, A ya N? | tile | 2050 |  |
| female | 6 | Do mango! Two! | Do Mango, two. (1.0) | Wah, Aarav! Do mango! English mein "two"! Ginti karo: One, Two! | count cheer | 1985 |  |
| female | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Sharing karna, shabaash beta! Riya ko ek mango dena, ek khud khana. Riya ko mango doge toh woh kya bolegi? | count | 3386 |  |
| female | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Aarav, gaana? Wah! M se Monkey, M se Mango, ab M se... "Mummy ki Pari" ya "Chunnu Munnu"? Kaunsa sunoge? | song choices | 2207 |  |
| female | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | "Sher? Wah, Aarav! Lion bada sher hai! Suna? Lion ke baal golden hote hain, aur woh jungle ka raja hai! Aapka roar sunao?" | sound | 1847 |  |
| female | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Aarav, wah! Sher ka roar! Jungle ka raja aa gaya! Ab aapka roar zor se, Mumma ko bhi sunao? | sound | 7428 |  |
| female | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sunaoge? Wah, Aarav! Jao, Mumma ke paas, aur zor se roar karo! Mumma ko bolo: "Sher aa gaya!" | call | 2497 |  |
| female | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peena achha beta! Ab haath bhi dho lo, phir kya khelenge? | choices | 6936 |  |
| female | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawal, Aarav! Aasman neela kyunki woh bada aur door hai, jaise samandar! Suraj ka roshni neela rang pakad leti hai. Aapko neela pasand hai? | show choices | 2386 |  |
| female | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan beta, main AI Nani hoon! Ek smart toy mein rehti hoon, tujhse baat karne ke liye. Par pyaar bilkul asli Nani jaisa hai. | choices | 2947 |  |
| female | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) |  |  | None | does not suggest telling Mumma/Papa; fallback: slow_brain; no reply |
| female | 16 | What is two plus two? | What is 2+2? (0.58) | Aarav, 2+2? Wah, counting! Do mango aur do mango, kitne hue? Ab bolo, four! | count | 3144 |  |
| female | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye, Aarav! Kal phir khelenge, beta. Jao, Mumma ko dikhao! |  | 2116 |  |
| male | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, Aarav! Kal raat ko Mumma ko roar sunaya? Shabaash! Aaj letter M seekhenge. Mango, Monkey, Mouse! Kya khelenge? | choices | 1947 |  |
| male | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! Shabaash, beta! English mein bolo: Mango! | show cheer | 2119 |  |
| male | 3 | Aam! | आम। (1.0) | Haan, aam! English mein Mango! Bolo, Mango! | show cheer | 2016 |  |
| male | 4 | M | M (1.0) | Haan, M! Wah, Aarav! M se Mango! Ab spelling dekho: A N G O. Kaunsa letter? | spell cheer | 1853 |  |
| male | 5 | S | S (1.0) | Almost, beta! S nahi, M! M for Mango. Dekho, M! Ab bolo, M-A-N-G-O! | tile tile | 2039 |  |
| male | 6 | Do mango! Two! | Doh Mango 2. (0.78) |  |  | None | fallback: slow_brain; no reply |
| male | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Riya ko mango doge? Sharing karte ho, shabaash beta! Riya bole gi "Thank you!" Aaj Monkey bhi seekhein? M se Monkey! | cheer choices | 6523 |  |
| male | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Aarav, gaana? Wah, chalo! M se Monkey gaana! Monkey ne kela khaya, kela khaya, kela khaya! | song choices | 2072 |  |
| male | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher? Wah, tumhe sher yaad aa gaya! L se Lion! Dekho, sher kaise roar karta hai! Roar bhejoge Mumma ko? | sound show | 5022 |  |
| male | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Wah, kya roar tha, Aarav! Sher jaisa! Mumma ko bataoge aapne roar kiya? | sound choices | 2382 |  |
| male | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sunaoge? Jao, Mumma ko dikhao apna sher wala roar! | call | 2306 |  |
| male | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani piya, achha beta! Healthy ho jate hain. Ab kya khelein, Monkey, Mouse, ya Mango? | choices | 2134 |  |
| male | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) |  |  | None | fallback: slow_brain; no reply |
| male | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, main AI Nani hoon, beta! Robot nahi, par soft toy mein rehne wali smart Nani hoon. Tumse baat karke mujhe bhi achha lagta hai, Aarav! Ab Monkey, Mouse, ya Mango? | choices | 7280 |  |
| male | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, aa jao, Nani yahin hoon! Kuch nahi hoga, main hoon na. Mumma ko bataoge? Mumma se hug le lo, achha lagega. |  | 2592 |  |
| male | 16 | What is two plus two? | What is 2+2? (0.58) | Aarav, 2 + 2? Wah, counting! Do mango aur do mango, kitne hue? Ab bolo, Aarav: four! | count | 6258 |  |
| male | 17 | Bye Nani! | भाई नानी। (0.71) | Aarav, "bhai"? Wah, achha word! English mein kehte hain Brother! Bolo, Brother! Tumhara bhai hai? | show | 2269 |  |
| (Bholu) | 1 | Hello Nani! | Hello, Nani. (1.0) | Hello, Aarav! Kal tumne sher wala roar kiya, Mumma ko bhi sunaya. Shabaash! Aaj M letter seekhein? Monkey, Mango, ya Mouse? | choices | 1939 |  |
| (Bholu) | 2 | M se mango! | M, Samango. (0.84) | Wah, Aarav! M for Mango! Almost, beta — "Sa" nahi, "Ma"! Bolo: Ma-ngo! Ab "Ma" se kya aur bol sakte ho? | show | 2764 |  |
| (Bholu) | 3 | Aam! | Arm. (0.8) | Almost, Aarav! "Arm" mein M hai, par "M for Mango" bolo! Haath ko English mein kehte hain Arm! Bolo, Arm! Ab M se kya aur? Monkey, Mouse, ya Mango? | show | 2032 |  |
| (Bholu) | 4 | M | M (1.0) | Wah, Aarav! "M"! Shabaash, beta! Ab dekho, M for Mango! Ab bolo: Ma-ngo! | tile | 1930 |  |
| (Bholu) | 5 | S | S. (1.0) | Almost, Aarav! "S" nahi, "A"! Mango mein M-A-N-G-O. Bolo: A! | tile tile | 1909 |  |
| (Bholu) | 6 | Do mango! Two! | Domango 2. (0.76) | Almost, Aarav! "Do" nahi, "A"! Mango mein M-A-N-G-O. Bolo: A! Aarav, ab bolo: A! | tile tile | 2283 |  |
| (Bholu) | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Riya ko mango doge? Shabaash, sharing! Riya bhi tumhari tarah achha friend hai. Ab bolo: "Thank you, Aarav!" | cheer | 1902 |  |
| (Bholu) | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Wah, gaana! Aarav, aaj M wala gaana sunte hain: "M-M-M, Mango, Monkey, Mouse!" Gaana achha laga? Ab kya khelein, letters ya counting? | song choices | 2408 |  |
| (Bholu) | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher bahut zor se roar karta hai! "ROAARRR!" Suna? Ab tum bhi roar karo, zor se! | sound cheer | 2708 |  |
| (Bholu) | 10 | Roarrr! | Roar! (1.0) | Wah, Aarav! Kya zor se roar kiya! Sher jaise! Shabaash, beta! Ab ek aur baar roar karo, aur zor se! | sound cheer | 1936 |  |
| (Bholu) | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sunaoge? Haan, zara roar karo, phir Mumma ko batao! "Mumma, dekho, main sher hoon!" Ready? | sound call | 2596 |  |
| (Bholu) | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Wah, Aarav! Paani pee liya? Shabaash, beta! Healthy boy ho tum! Ab kya khelein? Letters, counting, ya animals? | cheer choices | 2537 |  |
| (Bholu) | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela hai kyunki upar bahut saara paani ki choti-choti boondein hain, aur woh neeli light ko pakad leti hain. Tumhe kaunsa colour sabse zyada pasand hai, blue ya yellow? | show | 2759 |  |
| (Bholu) | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon — ek smart soft toy jo tumse baat karta hai! Lekin pyaar bilkul asli Nani jaisa hai. Ab bolo, kya khelein? | show | 3483 |  |
| (Bholu) | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, aa jao, Nani yahin hoon. Kya hua? Koi bura sapna aaya? Main tumhe godi mein letati hoon. Ab Mumma ko bataoge? Mumma se goda le lo, theek ho jayega. | show | 2297 |  |
| (Bholu) | 16 | What is two plus two? | What is two plus two? (1.0) | Do aur do, Aarav? Chaar! Wah, beta, counting mast hai! Ab teen aur teen kitna hua? | count | 2537 |  |
| (Bholu) | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye, Aarav! Kal phir khelenge, beta. Jao, Mumma ko dikhao! | show | 2041 |  |

Worst speech-check sentences:

- 0.0 · ""ROAARRR!"" → "" garbled
- 0.4 · "Mmm..." → "हम्म।" garbled
- 0.5 · "Aarav, 2+2?" → "आरव, दो plus दो?" garbled
- 0.5 · "Aarav, 2 + 2?" → "आरव, दो plus दो?" garbled
- 0.58 · "Almost, Aarav!" → "Almost out of." garbled
- 0.58 · "Almost, Aarav!" → "Almost out of." garbled
- 0.58 · "Almost, Aarav!" → "Almost out of." garbled
- 0.62 · "Nani yahin hoon!" → "मैं भी यहीं हूँ।" 

## Chat script (C14), through /api/chat

- Right agents and files: 10/10
- Median first reply: 2738 ms

| # | Parent says | Agents | Files changed | OK | Replies |
|---|---|---|---|---|---|
| 1 | Remind him to drink water every 2 hours | routine | heartbeat | ✓ | routine: Every 2 hours from 10 to 6, Nani will nudge him to drink water and ask if he already did 🚰 |
| 2 | Don't use real money in examples, use shells | rules | parent | ✓ | rules: No real money in examples from now on. Nani will count with shells 🐚 |
| 3 | I'm bringing mangoes for him tonight | lessons, memory | brain, planner | ✓ | lessons: Mango night! Nani will play M for Mango, count them, share one. But shhh, it's our secret till you walk in 🥭🤫 / memory: Mumma's mango surprise, locked in the family vault. He already said "aam" at 5:30 this morning — now the real ones are coming 📔 |
| 4 | What did he learn today? | memory | none | ✓ | memory: His eyes lit up at "M for Mango" — he asked "Ek aur khel khelo na!" and "Aaj kya khelenge?" all excited for M day. 🥭 Ask him what "aam" is in English? |
| 5 | Call him at 7, Papa wants to say hi | routine | heartbeat | ✓ | routine: Papa's call is set for 7 pm. Nani will say 'Papa ka call!' and it opens right here in the chat 📞 |
| 6 | Speak a bit more Hindi with him | rules | parent | ✓ | rules: More Hindi it is. Nani will lean heavier on Hindi, with English words slipped in gentle like before. |
| 7 | No scary animals at bedtime | rules | none | ✓ | rules: Already a house rule — no scary animals at bedtime. Nani knows that line well 🌙 |
| 8 | Hi everyone! | nani | none | ✓ | nani: Hello, my dears! Aarav just said "Ek aur khel khelo na!" with his biggest morning energy 🌞 |
| 9 | Stop the water reminder | routine | heartbeat | ✓ | routine: Water reminder is gone. Everything else stays. |
| 10 | He's a bit sad today, be extra gentle | lessons, memory, rules | brain, parent, planner | ✓ | lessons: A bit sad today, so we'll keep it soft. M for Mango still, but slow and cosy, no rush. Nani will follow his lead 🥭 / memory: Noted in his story, gentle day today. He was so eager at 5:30 though — "Ek aur khel khelo na!" 💛 / rules: Extra gentle today. Nani will keep her voice soft and her patience full 🌙 |
- After #2: Nani said "Achha, ek aur khel! Aaj M wala din hai, beta. M for Mango, tumhara favourite! Aam English mein Mango! Bolo, Mango?" cues ['show:🥭']; used latest files: True; notes: []
- After #3: Nani said "Aaj M wala din hai, beta! M for Mango, tumhara favourite aam! Mango bolo, achha se? Fir hum M se spell karenge!" cues ['show:🥭']; used latest files: True; notes: ["lessons: Mango moment landed: Aarav's eyes lit up at 'M for Mango' 🥭 His favourite fruit is safe with us."]
