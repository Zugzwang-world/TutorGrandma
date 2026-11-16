# SELFTEST · 2026-11-17 02:54 IST · https://tutor-grandma.vercel.app

## Voice script (C14), through /api/turn with real audio

- Turns: 51 (3 voices × 17 lines)
- Median ms: speech-to-text 631, brain first word 1531, voice first audio 1930, total 2871
- Client: first `say` with audio at a median of 2121 ms after the request (paw release adds the instant reaction at ~0 ms)
- Heard correctly (overlap ≥ 0.6): 46/51
- Speech check: 182/185 sentences pass (98%)
- Turns with issues: 5

| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |
|---|---|---|---|---|---|---|---|
| female | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, beta! Aaj hum letter M seekhenge. Aarav, pehle kya khelen? | choices | 3031 |  |
| female | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! English mein bolo: Mango! | show | 2506 |  |
| female | 3 | Aam! | Arm. (0.8) | Almost, beta! "Arm" mein A hai. Mango mein pehla letter M! Bolo: Mmm... Mango! | tile tile | 3413 |  |
| female | 4 | M | M. (1.0) | Shabaash, Aarav! M for Mango! Ab bolo poora: Mango! | tile | 2048 |  |
| female | 5 | S | S. (1.0) | Almost, beta! S se Snake hota hai. Ab dusra letter: M-A-N-G-O. Bolo: Aa... | spell | 2136 |  |
| female | 6 | Do mango! Two! | Do Mango, Two. (1.0) | Wah, Aarav! Do mango! English mein Two! Do mango, do! Ab bolo: Two! | count | 2151 |  |
| female | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Sharing with Riya! Shabaash, beta! Ek Riya ko, ek Aarav ko. Dono khush! Ab bolo: Sharing! | cheer | 1999 |  |
| female | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) |  |  | None | fallback: slow_brain; no reply |
| female | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) |  |  | None | fallback: slow_brain; no reply |
| female | 10 | Roarrr! |  (0.0) |  |  | None | fallback: not_heard; no reply |
| female | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko dikhaoge? | call | 2564 |  |
| female | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, beta! Paani piya, wah! Ab M-A-N-G-O. Dusra letter kya hai? | spell | 1864 |  |
| female | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela hai kyunki light aise ghoomti hai. Jaise paani ka rang! Ab bolo: Blue! | show | 2626 |  |
| female | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon! Smart toy mein rehti hoon, tujhse baat karti hoon. Ab bolo, M-A-N-G-O ka dusra letter? | show | 2511 |  |
| female | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, aa jao Nani ke paas. Kya hua? Kuch batao. Mumma ya Papa ko bhi bataoge? | call | 2351 |  |
| female | 16 | What is two plus two? | What is 2+2? (0.58) | Do mango aur do mango! Kitne hue? Bolo, four! | count | 1866 |  |
| female | 17 | Bye Nani! | Bye, Nani. (1.0) | Bye, Aarav! Kal phir khelenge. Jao, Mumma ko dikhao! |  | 3994 |  |
| male | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, beta! Aarav! Kal M-A-N-G-O seekha tha, yaad hai? Aaj kya khelen? | choices | 2155 |  |
| male | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! Shabaash! English mein bolo: Mango! | show | 1878 |  |
| male | 3 | Aam! | आम। (1.0) | Haan, aam! English mein Mango! Bolo: Mango! Ab M se kya aur hai? Monkey? Mouse? | cheer | 2231 |  |
| male | 4 | M | N. (0.0) | Almost! N se naam shuru hota hai, par yahan M chahiye. Dekho: M-A-N-G-O. Ab bolo: Mango! | tile | 1834 |  |
| male | 5 | S | Yes. (0.5) | Bolo: Mango! Ab M-A-N-G-O mein teesra letter kaunsa hai? | tile | 1941 |  |
| male | 6 | Do mango! Two! | Dough Mango 2. (0.72) | Nani: Dough? Almost, beta! D se Dough hota hai. M chahiye: M-A-N-G-O. Bolo: Mango! teesra letter N hai, yaad hai? | tile | 2104 |  |
| male | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Riya ko mango doge? Sharing karte ho, shabaash! Riya kya bolegi? "Thank you!"? | cheer | 1828 |  |
| male | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Aarav, gaana! Wah! Nani ka counting gaana sunoge? Ya phir "M se Mango" wala gaana khud gao? | song choices | 1735 |  |
| male | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher! Wah! Tera favourite! Sun, sher ka zor se roar! Bolo: Lion! Sher English mein Lion! | sound show | 4071 |  |
| male | 10 | Roarrr! |  (0.0) |  |  | None | fallback: not_heard; no reply |
| male | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sher ka roar sunaoge? Jao, Mumma ko dikhao! | sound call | 2678 |  |
| male | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani piya, achha beta! Ab sher ka roar Mumma ko sunaoge, ya aur khelna hai? | show | 2001 |  |
| male | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela dikhta hai kyunki light aasman se takrati hai. Blue matlab neela! Tera favourite colour kaunsa hai? | show | 2155 |  |
| male | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta! Main AI Nani hoon, soft toy ke andar rehne wali. Par pyaar bilkul asli Nani jaisa hai! Ab batao, sher ka roar Mumma ko sunaoge ya kuchh aur? | show | 1983 |  |
| male | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta! Dar mat! Nani yahin hoon, soft toy mein. Kya hua, batao? Mumma ko bulaun? | show | 2004 |  |
| male | 16 | What is two plus two? | What is 2 plus 2? (0.78) | Aarav, do plus do! Ginti karte hain! Do mango aur do mango, kitne hue? Bolo, Aarav! | count | 2536 |  |
| male | 17 | Bye Nani! | भाई नानी। (0.71) | Aarav, bhai! Wah! Bhai matlab Brother! English mein kehte hain Brother! Bolo, Brother! | show | 2101 |  |
| (Bholu) | 1 | Hello Nani! | Hello, Nani. (1.0) | Hello, Aarav! Nani yahin hoon, beta. Kal tu bhai bola, shabaash! Aaj kya khelenge? Gaana, letters, ya ginti? | choices | 2283 |  |
| (Bholu) | 2 | M se mango! | M, Samango. (0.84) | Wah, Aarav! M for Mango! Samango matlab... Aam! English mein kehte hain Mango! Bolo, Mango! | show | 1936 |  |
| (Bholu) | 3 | Aam! | Arm. (0.8) | Almost, Aarav! Arm mein A nahin, M aata hai. Bolo: M-M-Mango! Tera favourite fruit kaunsa hai, aam ya kela? | show | 2093 |  |
| (Bholu) | 4 | M | M. (1.0) | Shabaash, Aarav! M-M-Mango! Ab bolo, Mango! | tile show | 2106 |  |
| (Bholu) | 5 | S | S. (1.0) | Almost, beta! M ke baad A aata hai, S nahin. Bolo: M-A... Mango! | tile spell | 1917 |  |
| (Bholu) | 6 | Do mango! Two! | Domango 2. (0.76) | Aarav, wah! Do mango! Ginti karte hain! Ek mango, do mango! Ab bolo, "Two mango!" | count | 1973 |  |
| (Bholu) | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Aarav, wah! Riya ko mango doge? Shabaash, sharing! Riya tera best friend hai na? | cheer | 1909 |  |
| (Bholu) | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Gaana, achha! Nani ka counting song sunoge? Ek se lekar das tak! Ginti ke baad kya khelenge, Aarav? | song choices | 1795 |  |
| (Bholu) | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Lion ka roar? Wah, Aarav! Tera favourite sher! Suno, kaise dhamakta hai! Ab tu bhi roar karke dikhao, shabaash! | sound | 5959 |  |
| (Bholu) | 10 | Roarrr! | Roar! (1.0) | Wah, Aarav! Kya zabardast roar hai! Sher jaise dhamakta hai! Mumma ko bhi sunaoge? | sound | 1812 |  |
| (Bholu) | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sunaoge? Achha! Abhi call lagate hain! | call | 2283 |  |
| (Bholu) | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peeti ho toh energy aati hai! Ab wapas khelein? Animals, letters, ya home? |  | 2426 |  |
| (Bholu) | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Aarav, achha sawaal! Aasman neela hai kyunki light neela rang zyada failaati hai! Tera favourite colour kaunsa hai, beta? | show | 2427 |  |
| (Bholu) | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon! Nani jaisi baatein karti hoon, par andar thoda computer hai. Ab batao, blue pasand hai, ya red, ya yellow? |  | 2242 |  |
| (Bholu) | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Kisi cheez se dar lag raha hai? Nani yahin hoon, tumhare saath. Mumma ko bataoge, ya pehle Nani ko bataoge? | show | 2616 |  |
| (Bholu) | 16 | What is two plus two? | What is two plus two? (1.0) | Do aur do? Chaar! Wah, Aarav! Ginti mein expert ban rahe ho! Ab kya khelenge, beta? | count | 2074 |  |
| (Bholu) | 17 | Bye Nani! | Bye, नानी। (0.88) |  |  | None | fallback: slow_brain; no reply |

Worst speech-check sentences:

- 0.0 · "Nani ka counting gaana sunoge?" → "何かカウントインガーナスの芸？" garbled
- 0.33 · "Wah!" → "Wow!" garbled
- 0.58 · "Almost, Aarav!" → "Almost out of." garbled
- 0.67 · "Nani ka counting song sunoge?" → "何かCounting Songsのゲー？" 
- 0.71 · "M-M-Mango!" → "Mango." 
- 0.76 · "M se Mango!" → "M for Mango." 
- 0.8 · "M se Mango!" → "M Simbango." 
- 0.8 · "Bolo: Mmm..." → "बोलो। हम्म।" 

## Chat script (C14), through /api/chat

- Right agents and files: 10/10
- Median first reply: 2613 ms

| # | Parent says | Agents | Files changed | OK | Replies |
|---|---|---|---|---|---|
| 1 | Remind him to drink water every 2 hours | routine | heartbeat | ✓ | routine: Done! Every 2 hours from 10 to 6, Nani will ask Aarav to drink water 💧 |
| 2 | Don't use real money in examples, use shells | rules | parent | ✓ | rules: Got it! Nani will use shells for counting and examples 🐚 |
| 3 | I'm bringing mangoes for him tonight | lessons, memory | brain, planner | ✓ | lessons: Lovely! Today's play is all about mangoes 🥭. I'll keep your surprise a secret 🤫 / memory: Noted! Mango night stays our little secret 🤫 |
| 4 | What did he learn today? | memory | none | ✓ | memory: Aarav learned **M for Mango** today — he practiced saying it with Nani and loved the mango picture 🥭 Ask him what other M words he can think of! |
| 5 | Call him at 7, Papa wants to say hi | routine | heartbeat | ✓ | routine: Done! At 7 Nani will say 'Papa ka call!' and the call opens here 📞 |
| 6 | Speak a bit more Hindi with him | rules | parent | ✓ | rules: Done! Nani will use more Hindi today — more beta, shabaash and achha with Aarav 🙂 |
| 7 | No scary animals at bedtime | rules | none | ✓ | rules: Already on it! No scary animals at bedtime 🌙 |
| 8 | Hi everyone! | nani | none | ✓ | nani: Hello Mumma! Aarav and I just started with M for Mango 🥭 He's excited to learn more M words today 😊 |
| 9 | Stop the water reminder | routine | heartbeat | ✓ | routine: Done! No more water reminders. Nani will still remind him gently if she sees him playing long 😊 |
| 10 | He's a bit sad today, be extra gentle | lessons, memory, rules | brain, parent, planner | ✓ | lessons: Got it. Today's play will be extra gentle and cosy for Aarav 🤗 / memory: Noted. I'll keep an eye on his mood and let you know how he seems 🤍 / rules: Already in my heart, and now on paper too. Extra gentle Nani mode on 🌸 |
- After #2: Nani said "Achha, Aarav beta! Kal tune "Thank you, Nani!" kaha tha — wah! Shabaash! Aaj letter M seekhein? M for Monkey, Mango, Mumma! Kaunsa M word pasand hai?" cues ['show:🥭']; used latest files: True; notes: []
- After #3: Nani said "Aaj hum aam ke baare mein seekhenge, Aarav! M for Mango! Tera favourite fruit hai na? Bolo: Mango!" cues ['show:🥭']; used latest files: True; notes: ['lessons: Nani just taught Aarav about mangoes 🥭']
