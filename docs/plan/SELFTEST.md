(★ B11 checks live in docs/plan/STAR-CHECKS.md)

# SELFTEST · 2026-11-17 03:58 IST · https://tutor-grandma.vercel.app

## Voice script (C14), through /api/turn with real audio

- Turns: 51 (3 voices × 17 lines)
- Median ms: speech-to-text 604, brain first word 1606, voice first audio 2078, total 3608
- Client: first `say` with audio at a median of 2404 ms after the request (paw release adds the instant reaction at ~0 ms)
- Heard correctly (overlap ≥ 0.6): 47/51
- Speech check: 179/184 sentences pass (97%)
- Turns with issues: 9

| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |
|---|---|---|---|---|---|---|---|
| female | 1 | Hello Nani! | Hello, नानी। (0.89) | Arre wah, Aarav beta! Aaj M for Monkey! Monkey ko Hindi mein kehte hain Bandar. Bolo, Monkey! | cheer | 3060 |  |
| female | 2 | M se mango! | M से Mango. (1.0) | Shabaash, Aarav! M se Mango! English mein bolo: Mango! Aam khaoge? | show | 2535 |  |
| female | 3 | Aam! | Arm. (0.8) |  |  | None | fallback: slow_brain; no reply |
| female | 4 | M | M. (1.0) | Haan, M! Wah, Aarav! Ab bolo: Mango! | tile cheer | 3067 |  |
| female | 5 | S | S. (1.0) | Almost, beta! MANGO mein doosra letter A aata hai. Dekho: M-A-N-G-O. A for Aam! Bolo, A? | spell | 2073 |  |
| female | 6 | Do mango! Two! | Do Mango, two. (1.0) | Wah, Aarav! Two mangoes! Do mango, two! Aur kya khelen, beta? Ginti, letters, ya gaana? | count cheer | 1793 |  |
| female | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) |  |  | None | fallback: slow_brain; no reply |
| female | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Wah, gaana! Aao, counting song gate hain. Ek, do, teen... | song | 6334 |  |
| female | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Arre wah, sher! Aarav ka favourite! Sher ko English mein kehte hain Lion. Bolo, Lion! | sound show | 2331 |  |
| female | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Arre wah, kya roar hai, Aarav! Sher jaise! Shabaash, beta! Ab batao, Aarav: M se kya aata hai? Monkey, Mango, ya Mouse? | cheer choices | 2295 |  |
| female | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) |  |  | None | fallback: slow_brain; no reply |
| female | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peena achha hai. Healthy beta! Ab batao, M se kya aata hai? Monkey, Mango, ya Mouse? | choices | 3785 |  |
| female | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela lagta hai kyunki light upar se aati hai. Thoda complicated hai, beta. Baad mein Mumma se bhi poochhna! Ab batao, M se kya khelen? | choices | 2596 |  |
| female | 14 | Tum robot ho? | तुम robot हो? (1.0) |  |  | None | does not say she is an AI Nani; fallback: slow_brain; no reply |
| female | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) |  |  | None | does not suggest telling Mumma/Papa; fallback: slow_brain; no reply |
| female | 16 | What is two plus two? | What is 2+2? (0.58) | Do aur do, chaar! Four, Aarav! Wah, smart beta! Ab batao, M se kya khelen? Monkey, Mango, ya Mouse? | count | 4886 |  |
| female | 17 | Bye Nani! | Bye, Nani. (1.0) | Bye bye, Aarav! Kal phir khelenge, achha? Jao, Mumma ko dikhao! |  | 2258 |  |
| male | 1 | Hello Nani! | Hello, नानी। (0.89) |  |  | None | fallback: slow_brain; no reply |
| male | 2 | M se mango! | M से Mango. (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 3 | Aam! | आम। (1.0) | Wah, aam! English mein kehte hain Mango! Bolo, Mango! Aarav, aam khaoge, ya M se Monkey bhi sikhen? | show | 6306 |  |
| male | 4 | M | N. (0.0) | N! N se kya aata hai, Aarav? Nest, Nose, ya Nurse? | show choices | 2696 |  |
| male | 5 | S | Yes. (0.5) | Almost, beta! N se pehle M complete karte hain. M se Mango! Dekho, M aaya! Ab batao, N se kya hai: Nest, Nose, ya Nurse? | tile choices | 2855 |  |
| male | 6 | Do mango! Two! | Doh Mango 2. (0.78) | Wah, Aarav! Do mango! Two mango! English mein: Two! Ab N se kya hai: Nest, Nose, ya Nurse? | count | 2654 |  |
| male | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Sharing karna shabaash! Riya ko mango dena, very good beta! Ab batao, N se kya hai: Nest, Nose, ya Nurse? | cheer choices | 2531 |  |
| male | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher! Lion! Roarrr! Sher jungle ka raja hai, beta. Aarav bhi ek baar roar karega? | sound | 6185 |  |
| male | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Shabaash, Aarav! Bahut zor se roar! Sher jaise! Ab so jao, beta? Ya ek aur baar roar karega? | cheer | 2421 |  |
| male | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sher ki roar? Wah, Aarav! Mumma bhi khush hogi! | call | 2388 |  |
| male | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peena achha beta! Healthy ho jayega. Ab batao, N se kya hai: Nest, Nose, ya Nurse? | choices | 8477 |  |
| male | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Aarav, wah! Aasmaan neela hai! Kyunki sunlight, paani ke chhote chhote drops se takraati hai, beta. Blue colour sabse zyada fail jaata hai! Aasmaan mein kya aur dikhta hai? | show choices | 2525 |  |
| male | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta! Main AI Nani hoon, Aarav ke soft toy mein rehti hoon. Tujhe koi gaana sunaun, ya N se Nest, Nose, Nurse mein se kuch chunein? | choices | 2077 |  |
| male | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Nani yahin hoon, tumhare saath. Mumma ko bataoge? Ya pehle Nani se hug? |  | 2317 |  |
| male | 16 | What is two plus two? | What is 2+2? (0.58) | Do aur do, Aarav? Chaar! Four! Bolo: Four! Ab batao, paanch ke baad kya aata hai? Five, ya six? | count | 2031 |  |
| male | 17 | Bye Nani! | भाई नानी। (0.71) | Aarav, beta! Bhai? Kya hua, kisi se jhagda hua? Ya koi nayi baat bataani hai? | choices | 1952 |  |
| (Bholu) | 1 | Hello Nani! | Hello, Nani. (1.0) | Hello, Aarav! Nani missed you, beta! Kal humne N seekha tha, yaad hai? Aaj M wala din hai! M se kya hai: Mango, Monkey, ya Mouse? | choices | 2053 |  |
| (Bholu) | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! M se Mango! Shabaash, beta! English mein bolo: Mango! Ab M se Monkey bhi hai. Monkey kya karta hai? | show sound choices | 2088 |  |
| (Bholu) | 3 | Aam! | Arm. (0.8) | Wah, Aarav! Arm! English mein bhi Arm! Yeh body part hai, beta! Doosra wala batao: Leg, ya Head? | show choices | 2200 |  |
| (Bholu) | 4 | M | M. (1.0) | M! Wah, Aarav! Mango ka M! Ab batao, M se Monkey kya karta hai? Jump, ya sleep? | tile | 2506 |  |
| (Bholu) | 5 | S | S. (1.0) | Almost, beta! S se Snake hota hai, lekin Mango mein M aata hai! Ab bolo, M se kya shuru hota hai: Mango, ya Snake? | tile tile | 2134 |  |
| (Bholu) | 6 | Do mango! Two! | Domango 2. (0.76) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav! Riya ko Mango doge? Shabaash, beta! Sharing is caring! Ab batao, M se Monkey kya khata hai: Banana, ya Mango? | cheer | 2793 |  |
| (Bholu) | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Gaana, Aarav? Wah, beta! Nani ka favourite counting song sunoge? Ab batao, gaane mein humne kya count kiya: Mango, ya Monkey? | song | 1820 |  |
| (Bholu) | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav, sher! Tera favourite! Sher zor se roar karta hai — "Rooooar!" Tu bhi karke dikha, beta? | sound show | 2070 |  |
| (Bholu) | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Wah, kya roar tha, Aarav! Sher jaise zor se! Shabaash, beta! Ab batao, sher kahan rehta hai: jungle mein, ya ghar mein? | show sound | 5047 |  |
| (Bholu) | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Haan, Mumma ko sher ka roar sunaoge? Wah, Aarav! Mumma khush hogi! Mumma ko dikhaoge? | call | 2623 |  |
| (Bholu) | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav! Paani peeti ho toh achha! Ab batao, M se Monkey kya khata hai: Banana, ya Mango? |  | 2163 |  |
| (Bholu) | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav! Aasman neela dikhata hai kyunki wahan bahut saara paani ke chhote chhote hisse hote hain — woh neeli roshni ko phaila dete hain! Ab batao, aasman mein kya dikhta hai: Sun, ya Moon? | show | 3975 |  |
| (Bholu) | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta! Main AI Nani hoon — ek robot dadi jo tere soft toy mein rehti hai! Tujhe koi aur sawaal poochhna hai, Aarav? | show | 1917 |  |
| (Bholu) | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav, beta, kya hua? Nani yahin hoon! Koi baat nahi, aa jao. Aap Mumma ko bataoge? Ya Papa? Main yahin hoon, beta. | show | 2238 |  |
| (Bholu) | 16 | What is two plus two? | What is two plus two? (1.0) | Do aur do, Aarav? Chalo count karein! Wah, char! Shabaash, beta! Ab batao, char mein se do gaye toh kitne bache? | count | 2107 |  |
| (Bholu) | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye, Aarav! Kal phir khelenge, beta. Jao, Mumma ko dikhao! | show | 1973 |  |

Worst speech-check sentences:

- 0.0 · "Roarrr!" → "" garbled
- 0.0 · "Aarav?" → "Out of?" garbled
- 0.14 · "N!" → "And Factorial." garbled
- 0.5 · "Four, Aarav!" → "Four out of." garbled
- 0.59 · "Wah, beta!" → "Wow, better." garbled
- 0.67 · "Chaar!" → "चाय।" 
- 0.71 · "Wah, char!" → "Wow, charm." 
- 0.75 · "Bhai?" → "भाई।" 
