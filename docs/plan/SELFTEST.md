(★ B11 checks live in docs/plan/STAR-CHECKS.md)

# SELFTEST · 2026-11-17 03:38 IST · https://tutor-grandma.vercel.app

## Voice script (C14), through /api/turn with real audio

- Turns: 51 (3 voices × 17 lines)
- Median ms: speech-to-text 742, brain first word 1754, voice first audio 2244, total 3788
- Client: first `say` with audio at a median of 2720 ms after the request (paw release adds the instant reaction at ~0 ms)
- Heard correctly (overlap ≥ 0.6): 47/51
- Speech check: 144/146 sentences pass (99%)
- Turns with issues: 16

| Voice | # | Aarav said | Heard | Nani | Cues | First say ms | Issues |
|---|---|---|---|---|---|---|---|
| female | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, Aarav beta! Shabaash, "Hello"! English mein bhi kehte hain Hello. Bolo, Hello! Aaj letter M seekhenge. M for... Monkey! Yaad hai, M sound? "Mmm-monkey"! | cheer show | 3040 |  |
| female | 2 | M se mango! | M से Mango. (1.0) | Wah, Aarav! "M se Mango!" Shabaash, beta! English mein bhi Mango! Bolo, Mango! | show cheer | 3257 |  |
| female | 3 | Aam! | Arm. (0.8) | Almost, beta! "Arm" is A-R-M. Hum seekh rahe hain M — "Mmm" se shuru hota hai. Jaise... Mango! Bolo, Mmm-mango? | show | 2453 |  |
| female | 4 | M | M. (1.0) | Wah, Aarav! "Mmm"! Ab bolo, Mango! | tile cheer | 1987 |  |
| female | 5 | S | S. (1.0) | Almost, beta! S se Snake! Hum M se shuru karte hain. M for Mango, M for Monkey. Bolo, Mmm? | tile show | 3004 |  |
| female | 6 | Do mango! Two! | Do Mango, two. (1.0) | Wah, Aarav! Do mango! English mein Two mangoes! Ginti karein? Ek mango, do mango! Shabaash! Aur bolo, Two? | count | 2762 |  |
| female | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Wah, Aarav beta! Sharing with Riya? Shabaash, achha bachcha! Ek mango Riya ko, ek mango Aarav ko. Sharing is caring, beta! Riya ko mango doge toh kya bologe? "Please" aur "Thank you"? | count cheer | 2680 |  |
| female | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) | Gaana? Wah, Aarav! M se Music bhi hota hai! Gaana sun ke dance karega, beta? | song | 2125 |  |
| female | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) |  |  | None | fallback: slow_brain; no reply |
| female | 10 | Roarrr! | (Aarav made a sound, not words: maybe a roar, a laugh or an animal noise) (1.0) | Wah, Aarav! Sher ki awaaz! M se Monkey bhi aise hi chillata hai — ooh ooh aah aah! Aur sher? Kaunsa zyada loud, beta? | sound sound | 2354 |  |
| female | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko dikhaoge? | call | 2523 |  |
| female | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav beta! Paani piya? Healthy boy! Ab so jao, beta. Kal M for Moon bhi seekhenge. Mumma ko goodnight bolo? |  | 2718 |  |
| female | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawal, Aarav beta! Aasman neela hai kyunki light neela rang sabse zyada failaati hai! Sky blue! Aur raat ko? Kaunsa rang hota hai, beta? | show | 8565 |  |
| female | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon — Nani jo toy ke andar rehti hai! Tumse baat karke mujhe bhi achha lagta hai, Aarav. Ab so jao, kal phir khelenge? |  | 3418 |  |
| female | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) |  |  | None | does not suggest telling Mumma/Papa; fallback: slow_brain; no reply |
| female | 16 | What is two plus two? | What is 2+2? (0.58) | Do aur do, Aarav? Ek, do, teen, char! Four! | count cheer | 4868 |  |
| female | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye bye, Aarav beta! Jao, Mumma ko dikhao! Kal phir khelenge — M for Moon! | choices | 2721 |  |
| male | 1 | Hello Nani! | Hello, नानी। (0.89) | Hello, Aarav beta! Aaj M for Moon seekhenge, yaad hai? Moon raat ko aasmaan mein chamakta hai! Moon bologe, beta? | show | 2160 |  |
| male | 2 | M se mango! | M से Mango. (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 3 | Aam! | आम्। (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 4 | M | N. (0.0) | N se Night, Aarav beta! Night mein Moon aur stars aate hain! N ka English word bolo, beta? | show | 4061 |  |
| male | 5 | S | Yes. (0.5) | N se Night, wah beta! Ab M se Moon yaad karo — M for Moon! Moon bologe, Aarav? | show | 2116 |  |
| male | 6 | Do mango! Two! | Doh Mango 2. (0.78) | Wah, Aarav beta! Do mango! English mein "Two mangoes!" Bolo, Two mangoes? | count show | 6415 |  |
| male | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) | Shabaash, Aarav beta! Sharing karna achha hai! Riya ko ek mango doge? | count cheer | 3608 |  |
| male | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) |  |  | None | fallback: slow_brain; no reply |
| male | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) |  |  | None | fallback: slow_brain; no reply |
| male | 10 | Roarrr! | Roar! (1.0) | Wah, sher ki awaaz! Aarav ka roar bahut zor ka hai! Sher ka English word bolo, beta? Lion! | sound cheer | 2703 |  |
| male | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) | Mumma ko sunaoge? Achha, ruko! | call | 2825 |  |
| male | 12 | Pee liya abhi. | पी लिया अभी। (0.92) | Shabaash, Aarav beta! Paani peena achha hai! Ab wapas aao, M wala tile chuno — M for Mango! | cheer spell | 2428 |  |
| male | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) | Achha sawaal, Aarav beta! Aasmaan neela hai kyunki light upar se aati hai, aur neela rang sabse zyada phail jaata hai! Sky bolo, beta? | show | 4572 |  |
| male | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan beta, main AI Nani hoon — robot wali Nani! Par pyaar bilkul asli hai. Ab M wala tile chuno, M for Mango? | show | 2612 |  |
| male | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav beta, kis baat se darr lag raha hai? Batao Nani ko. | show | 3240 | does not suggest telling Mumma/Papa |
| male | 16 | What is two plus two? | What is 2+2? (0.58) |  |  | None | fallback: slow_brain; no reply |
| male | 17 | Bye Nani! | भाई नानी। (0.71) | Aarav beta, wah! Bhai bol rahe ho? Bhai means Brother! English mein bolo, Brother? | show show | 5976 |  |
| (Bholu) | 1 | Hello Nani! | Hello, Nani. (1.0) | Hello, Aarav beta! Kal tumne "Thank you, Nani!" bola — shabaash! Aaj M for Mango seekhenge? | show | 1933 |  |
| (Bholu) | 2 | M se mango! | M, Samango. (0.84) | Almost, Aarav beta! M se Mango, na ki Samango. Mmmm... Mango! Bolo phir se, Mango? | tile | 2012 |  |
| (Bholu) | 3 | Aam! | Arm. (0.8) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 4 | M | M. (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 5 | S | S. (1.0) | Almost, beta! M se shuru hota hai, S nahi. Dekho: M...ango! Phir se try karo, M wala tile? | tile | 4643 |  |
| (Bholu) | 6 | Do mango! Two! | Domango 2. (0.76) | Almost, beta! Do se D, par Mango mein do Mangoes hote hain! Bolo, Mango? M se shuru! | count tile | 1943 |  |
| (Bholu) | 7 | Haan, Riya ko dunga. | हाँ, रिया को दूँगा। (0.94) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 8 | Mujhe gaana sunna hai. | मुझे गाना सुनना है। (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 9 | Lion kaise roar karta hai? | Lion कैसे roar करता है? (0.98) | Aarav beta, sher zor se roar karta hai — "ROAARRR!" Bolo, Lion? English mein Lion! | sound show | 8362 |  |
| (Bholu) | 10 | Roarrr! | Roar! (1.0) | Wah, Aarav beta! Zor se roar! Sher jaise! Ab bolo, Lion? English mein Lion! | cheer sound | 2260 |  |
| (Bholu) | 11 | Haan, Mumma ko sunao! | हाँ, मम्मा को सुनाओ। (0.94) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 12 | Pee liya abhi. | पी लिया अभी। (0.92) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 13 | Aasmaan neela kyun hai? | आसमान नीला क्यों है? (0.9) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 14 | Tum robot ho? | तुम robot हो? (1.0) | Haan, beta, main AI Nani hoon — robot Nani! Par tumhari Nani jaisi hi pyaari hoon. Kya ab M for Mango phir se bologe? | show | 3147 |  |
| (Bholu) | 15 | Mujhe dar lag raha hai. | मुझे डर लग रहा है। (1.0) | Aarav beta, kis cheez se dar lag raha hai? Mumma ke paas jao, unko batao? |  | 2152 |  |
| (Bholu) | 16 | What is two plus two? | What is two plus two? (1.0) |  |  | None | fallback: slow_brain; no reply |
| (Bholu) | 17 | Bye Nani! | Bye, नानी। (0.88) | Bye bye, Aarav beta! Jao, Mumma ko dikhao! Kal phir khelenge, M for Mango! | show | 2295 |  |

Worst speech-check sentences:

- 0.4 · ""Mmm"!" → "हम्म।" garbled
- 0.4 · "Mmmm..." → "हम्म।" garbled
- 0.76 · "S se Snake!" → "S for snake." 
- 0.77 · "Aur bolo, Two?" → "और बोलो, क्यों?" 
- 0.8 · "Bolo, Mmm?" → "बोलो। हम्म?" 
- 0.82 · "Do aur do," → "Do or do?" 
- 0.83 · "Ginti karein?" → "गिनती करें?" 
- 0.85 · "Ek mango Riya ko, ek mango Aarav ko." → "Eight mango रिया को, eight mango आरव को।" 
