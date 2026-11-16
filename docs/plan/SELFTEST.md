(★ B11 checks live in docs/plan/STAR-CHECKS.md)

# SELFTEST · 2026-11-17 03:20 IST · https://tutor-grandma.vercel.app

## Voice script (C14), through /api/turn with real audio

- Turns: 51 (3 voices × 17 lines)
- Median ms: speech-to-text 695, brain first word 1646, voice first audio 2108, total 3353
- Client: first `say` with audio at a median of 2378 ms after the request (paw release adds the instant reaction at ~0 ms)
- Heard correctly (overlap ≥ 0.6): 48/51
- Speech check: 171/172 sentences pass (99%)
- Turns with issues: 13

| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |
|---|---|---|---|---|---|---|---|
| female | 1 | Hello Nani! | Hello, नानी। (0.89) | Achha beta, Aarav! Aaj letter M seekhenge. M for Monkey! Monkey bolo? | show | 2920 |  |
| female | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! Shabaash! M se Mango! English mein bolo: Mango! | show | 1883 |  |
| female | 3 | Aam! | Arm. (0.8) | Haan, Mango! Almost, beta. A for Apple, M for Mango. Bolo: Mango! | show cheer | 2423 |  |
| female | 4 | M | M. (1.0) | Wah, Aarav! M! M for Mango! Ab bolo: Mango! | tile | 2315 |  |
| female | 5 | S | S. (1.0) | Almost, beta! M se Mango. Ab A se Apple. Bolo: Apple! Apple ka colour kya hai? | show | 2185 |  |
| female | 6 | Do mango! Two! | Do Mango, two. (1.0) |  |  | None | fallback: slow_brain; no reply |
| female | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) |  |  | None | fallback: slow_brain; no reply |
| female | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) |  |  | None | fallback: slow_brain; no reply |
| female | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Wah, sher! Aarav, sher ka roar suna? Ab bolo: Lion! Lion kahan rehta hai? | sound show | 5524 |  |
| female | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Haan, Aarav! Sher ka roar! Wah, shabaash! Ab bolo: Lion! Lion ko jungle mein dikhoge? | cheer show | 2705 |  |
| female | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Wah, Aarav! Mumma ko sher ka roar sunaoge? Mumma aa rahi hain, beta! Roar karo! | call sound | 2446 |  |
| female | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Wah, shabaash, Aarav! Paani peeti ho toh achha lagta hai. Ab M wala Mango yaad hai? Bolo: Mango! | cheer show | 2796 |  |
| female | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawal, beta! Aasman neela dikhta hai kyunki sun ka light aasman mein scatter hoti hai. Neela colour sabse zyada scatter hota hai! Aarav, aasman mein aur kya dikhta hai? | show | 5349 |  |
| female | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon! Robot wali Nani, jo tumhare soft toy mein rehti hai. Par pyaar bilkul asli hai, Aarav! Ab bolo, Mango? | show | 7039 |  |
| female | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Mumma ya Papa ko bulaun? Ya main yahin hoon, pakad lo toy ko. | show | 2645 |  |
| female | 16 | What is two plus two? | What is 2+2? (0.58) | Do aur do, Aarav? Chaar! Wah, shabaash! Ab bolo: Four! Four apples! | count cheer | 2287 |  |
| female | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye, Aarav! Jao, Mumma ko dikhao! Kal phir khelenge, beta. Shabaash! |  | 2254 |  |
| male | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, Aarav! Kal raat ko tumne "Thank you, Nani!" kaha tha, wah! Aaj ka letter M hai. M for Mango, Monkey, ya Mumma? | show choices | 2080 |  |
| male | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! English mein bolo: Mango! Ab M se Monkey bhi hai. Bolna hai? | show cheer | 2066 |  |
| male | 3 | Aam! | आम। (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 4 | M | N. (0.0) | N se, Aarav? Abhi hum M seekh rahe hain! M se Mango, Monkey, Mumma. N kal karenge, beta. M wala tile chuno: ANGO mein kya aayega? | tile tile | 2032 |  |
| male | 5 | S | Yes. (0.5) | Wah, shabaash Aarav! M sahi jagah pe! Ab bolo: M-A-N-G-O, Mango! | tile spell cheer | 2324 |  |
| male | 6 | Do mango! Two! | Doh Mango 2. (0.78) | Wah, Aarav! Do mango! English mein: Two Mango! Ab count karo: ek, do! Aur bolo: Two! Two mangoes! | count cheer | 2080 |  |
| male | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Sharing karega Riya ko? Shabaash, beta! Ek mango Riya ko, ek mango tumhe. Do mango, two friends! | count cheer | 2210 |  |
| male | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Achha, Aarav! Gaana sunoge? Chalo, Nani ka counting song! | song choices | 2258 |  |
| male | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher bahut zor se roar karta hai! Suno: Ab bolo: Roar! Tum bhi roar karo, zor se! | sound cheer | 2901 |  |
| male | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Wah, Aarav! Kya zor se roar kiya! Sher jaise! Ab bolo: Roar! Aur bolna hai: Lion! | sound cheer show | 2309 |  |
| male | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) |  |  | None | fallback: slow_brain; no reply |
| male | 12 | Pee liya abhi. | पी लिया अभी। (0.92) |  |  | None | fallback: slow_brain; no reply |
| male | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawal, Aarav! Aasman neela hai kyunki light aise khelti hai. Tumhe neela colour pasand hai? | show choices | 4668 |  |
| male | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon — ek robot Nani jo tumhare soft toy mein rehti hai! Main tumhe khelna sikhaati hoon. Ab bolo: Robot! Robot pasand hai? | show | 3573 |  |
| male | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kyun darr lag raha hai? Yahan Nani hoon na, tumhare saath. Mumma ko bulaun? Mumma se baat karo? | show | 2692 |  |
| male | 16 | What is two plus two? | What is two plus two? (1.0) | Aarav, do aur do? Chalo count karein! Ek, do, teen, chaar! Do mango aur do mango, kitne hue? Chaar! Bolo: Four! | count | 2432 |  |
| male | 17 | Bye Nani! | भाई नानी। (0.71) | Aarav, beta! Bhai Nani? Wah, bhai bol rahe ho? Shabaash! Bhai matlab Brother! Bolo: Brother! | show cheer | 2364 |  |
| (Bholu) | 1 | Hello Nani! | Hello, Nani. (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 2 | M se mango! | M से Mango. (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 3 | Aam! | Arm. (0.8) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 4 | M | M. (1.0) | Wah, M! Aaj ka letter M hai, Aarav! M for Mango, M for Monkey! Bolo: M! Kya banaoge M se? | show | 2539 |  |
| (Bholu) | 5 | S | S. (1.0) | Almost, beta! S nahi, M! Mango shuru hota hai M se. Dekho: ANGO. Pehla letter kaunsa? Bolo: M for Mango! | tile tile show | 1914 |  |
| (Bholu) | 6 | Do mango! Two! | Domango 2. (0.76) | Wah, Aarav! "Do mango" — shabaash! Do ka matlab Two! Aur do aur do mango? Kitne hue, beta? Bolo: Four! | count | 2539 |  |
| (Bholu) | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Riya ko do mango? Shabaash, sharing karte ho! Riya teri best friend hai na? Bolo: Sharing! | show cheer | 2381 |  |
| (Bholu) | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Aarav, gaana? Wah, chalo! M for Monkey, monkey ne kya kiya? Gaana khatam hone ke baad kya khelenge? Letters, ya animals? | song choices | 2374 |  |
| (Bholu) | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Aarav, Mumma ko gaana sunaoge? Wah, chalo! Mumma, Aarav ne M for Monkey gaana gaya! | song call | 5720 |  |
| (Bholu) | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Wah, Aarav! Paani piya? Shabaash, achha beta! Ab kya khelenge, beta? Letters, animals, ya counting? | cheer choices | 2329 |  |
| (Bholu) | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Aarav, wah! Aasman neela? Soch rahe ho? Neela matlab Blue! Kyunki suraj ka light paani ke chhote chhote bubble se takraata hai. Blue dikhta hai! Bolo: Blue sky! | show show | 2371 |  |
| (Bholu) | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta! Main AI Nani hoon — ek robot Nani jo tere soft toy mein rehti hoon. Par pyaar bilkul asli Nani jaisa! Tujhe koi aur sawaal poochhna hai, Aarav? | show | 2313 |  |
| (Bholu) | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, dar lag raha hai? Aao, Nani yahin hoon. Kahan dar lag raha hai — andhere se, ya koi sapna aaya? Mumma ko bulaun? | show | 2886 |  |
| (Bholu) | 16 | What is two plus two? | What is two plus two? (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 17 | Bye Nani! | Bye, नानी। (0.88) |  |  | None | fallback: slow_brain; no reply |

Worst speech-check sentences:

- 0.29 · "Chaar!" → "Dad." garbled
- 0.62 · "Wah, M!" → "वाह! एवं।" 
- 0.75 · "Wah, sher!" → "Wow, Sher!" 
- 0.78 · "Bhai Nani?" → "भाई नानी?" 
- 0.82 · "Do aur do," → "Do or do?" 
- 0.82 · "S nahi, M!" → "S नहीं, M." 
- 0.85 · "M sahi jagah pe!" → "उम्म, सही जगह पे।" 
- 0.86 · "Achha, Aarav!" → "अच्छा, आरव।" 

## Chat script (C14), through /api/chat

- Right agents and files: 10/10
- Median first reply: 3200 ms

| # | Parent says | Agents | Files changed | OK | Replies |
|---|---|---|---|---|---|
| 1 | Remind him to drink water every 2 hours | routine | heartbeat | ✓ | routine: Done! Every 2 hours from 10 to 6, Nani will ask Aarav to drink water 💧 |
| 2 | Don't use real money in examples, use shells | rules | parent | ✓ | rules: Got it! No real money. Nani will count with shells with Aarav 🐚 |
| 3 | I'm bringing mangoes for him tonight | lessons, memory | brain, planner | ✓ | lessons: Lovely! Today's play is all about mangoes 🥭. I'll keep your surprise a secret 🤫 / memory: Noted! Mango night stays our little secret 🤫 |
| 4 | What did he learn today? | memory | none | ✓ | memory: He learned letter M for mango 🥭 and told Nani his favourite fruit is aam. Ask him what sound M makes! |
| 5 | Call him at 7, Papa wants to say hi | routine | heartbeat | ✓ | routine: Done! At 7 Nani will say 'Papa ka call!' and the call opens here 📞 |
| 6 | Speak a bit more Hindi with him | rules | parent | ✓ | rules: Theek hai! Nani aaj Aarav se thoda zyada Hindi mein baat karegi 🙂 |
| 7 | No scary animals at bedtime | rules | none | ✓ | rules: Already on it! No scary animals at bedtime 🌙 |
| 8 | Hi everyone! | nani | none | ✓ | nani: Hello! Aarav and I are just starting our M for Mango play 🥭 He's so excited to learn today! |
| 9 | Stop the water reminder | routine | heartbeat | ✓ | routine: Done, no more water reminders. |
| 10 | He's a bit sad today, be extra gentle | lessons, memory, rules | brain, parent, planner | ✓ | lessons: Got it. I'll keep today's play soft and gentle, no rushing. Just warm mango stories and easy questions 🥭 / memory: Noted. I'll remember today was a tender day for him 💛 / rules: Already in my heart, and now on paper too. Extra gentle it is 🤗 |
- After #2: Nani said "Achha, Aarav beta! Kya khelenge?" cues ['choices:']; used latest files: True; notes: []
- After #3: Nani said "Aaj hum M wala letter seekhenge, Aarav! M for Mango! Tera favourite fruit kaunsa hai?" cues ['show:🥭']; used latest files: True; notes: ['lessons: Nani and Aarav played with mangoes 🥭']
