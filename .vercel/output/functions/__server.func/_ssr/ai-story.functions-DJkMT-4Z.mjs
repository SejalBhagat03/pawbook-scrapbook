import { t as animals } from "./pawbook-data-Cp5uqNrO.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-story.functions-DJkMT-4Z.js
var Input = objectType({
	animalSlug: stringType(),
	mode: enumType([
		"story",
		"pov",
		"caption",
		"adoption"
	]),
	mood: stringType()
});
var weaveStory_createServerFn_handler = createServerRpc({
	id: "01186f47e847f7adfa0e2c3586c5bf1f47b59f007aaf699f531c7ec2c1a9dbdd",
	name: "weaveStory",
	filename: "src/lib/ai-story.functions.ts"
}, (opts) => weaveStory.__executeServer(opts));
var weaveStory = createServerFn({ method: "POST" }).inputValidator((input) => Input.parse(input)).handler(weaveStory_createServerFn_handler, async ({ data }) => {
	const animal = animals.find((a) => a.slug === data.animalSlug);
	if (!animal) throw new Error("Unknown friend");
	const key = process.env.API_GATEWAY_KEY || process.env.LOVABLE_API_KEY;
	if (!key) {
		const animalName = animal.name;
		const fav = animal.favoriteFood;
		const poolMap = {
			pov: {
				happy: [`Today was perfect. The sunshine fell exactly where my spots are, and I had some delicious ${fav}. Life in the village is so sweet. 🐾`, `I met three new human friends near the gate today! They patted my back, and I gave them my biggest tail wag. 😊`],
				funny: [`I saw a leaf falling from the sky. I jumped, did a spin in the air, and completely missed it. But the tea stall human laughed, so I count it as a win! 🍁`, `Someone dropped a Parle-G biscuit. I grabbed it and ran like the wind. I am the fastest dog in this village, no question. 🐕`],
				emotional: [`Sometimes I sit by the balcony and wonder where the birds go when it gets dark. I hope they all have warm nests like my cozy corner. 🌸`, `I heard the students talking about their homes. I don't have a door to go through, but when they pat me, I feel right at home. ❤️`],
				rain: [`The raindrops are playing music on the tin roof of the tea shop. I tucked my paws in and watched the puddles grow. Cozy afternoon! 🌧️`, `It is a bit cold, but a kind student wrapped a small blanket around me. I feel so loved in this quiet village. 🌧️`],
				rescue: [`I remember the day I was lost. My paws were so tired. But then kind hands picked me up, and I knew I would never be alone again. 🏡`, `Safe and sound. That is the best feeling. Hearing the quiet night sounds while knowing I have a dinner waiting tomorrow. ❤️`],
				night: [`The moon is a big glowing ball tonight. I'm keeping watch over College Street, but my eyes are getting very, very heavy... 😴`, `Time to curl up into a perfect circle. Goodnight to all the little paws and all the big hearts. 🌙`]
			},
			caption: {
				happy: [`Sunbeam checklist: found it, occupied it, took a nap. Life is good! ☀️🐾 #PawBook`, `Biscuit in mouth, wiggles in tail. Today is a 10/10! 🍪🐶 #HappyPaws`],
				funny: [`Chased a bug. The bug won. Please do not ask for details. 🐜💨 #VillageLife`, `Nap time is serious business. Do not disturb unless you have treats! 😴 #LazyDays`],
				emotional: [`Just a little soul hoping to bring a smile to your day. 🌸❤️ #ChooseKindness`, `My heart is full of small memories. Thank you for being a part of them. 🐾✨ #Grateful`],
				rain: [`Splish, splash, taking a nap under the tin roof. 🌧️ Cozy vibes only! #RainyDay`, `A little rain cannot stop a happy heart. ☔️🐕 #CozyStreet`],
				rescue: [`From a lost pup to the king of the corner. Thank you for keeping me safe! 🏡❤️ #RescueStory`, `Every street friend deserves a safe spot. 🐾 #RescueFriend`],
				night: [`Curled up and dreaming of endless fields of biscuits. Goodnight, world! 🌙💤 #SweetDreams`, `The stars are bright, but the love in this village is brighter. 😴✨ #NightNotes`]
			},
			story: {
				happy: [`In a cozy corner of ${animal.home}, ${animalName} was seen wearing a huge smile. A fresh packet of ${fav} was opened, and the day was officially declared perfect. 🌟`],
				funny: [`Rumor has it that ${animalName} spent the entire morning staring down a plastic cup, convinced it was a high-tech squirrel. The cup did not stand a chance. 🥤`],
				emotional: [`As evening settled over the village, ${animalName} leaned gently against a student's boots. No words were exchanged, but the warmth of friendship was felt by everyone passing by. 🌸`],
				rain: [`The sky poured cool rain, but ${animalName} stayed perfectly dry under the blue tarp. The smell of wet earth and tea made the village feel like a warm fairytale. 🌧️`],
				rescue: [`Every animal in the village has a day they remember—the day fear turned into friendship. For ${animalName}, it was a warm bowl of food and a soft voice that changed everything. 🏡`],
				night: [`The stars twinkled down on ${animal.home}. ${animalName} closed their eyes, letting out a soft sigh, safe in the knowledge that they are loved by the whole village. 🌙`]
			},
			adoption: {
				happy: [`${animalName} is a bundle of joy waiting to light up a home. With a love for ${fav} and a heart full of trust, they are ready for their forever adventure. 🏡`],
				funny: [`Looking for a professional butterfly watcher and full-time belly rub enthusiast? ${animalName} is currently accepting applications for a forever family! 📋`],
				emotional: [`Every animal has a story, and ${animalName}'s next chapter is waiting for a kind soul like you. Let's make their dream of a warm home come true. ❤️`],
				rain: [`Through the cold rains and hot summers, ${animalName} has kept a gentle spirit. They deserve a dry, cozy rug and a family to watch the storms with. ☔`],
				rescue: [`Having known the uncertainty of the streets, ${animalName} understands the value of a safe space. They promise a lifetime of loyalty and gentle nudges. 🏡`],
				night: [`As the stars shine tonight, ${animalName} is dreaming of a family to call their own. Could you be the one to answer their quiet prayer? ✨`]
			}
		};
		const pool = poolMap[data.mode]?.[data.mood] || poolMap.pov.happy;
		return { text: pool[(animalName.length + data.mood.length) % pool.length] + " 🌸" };
	}
	const prompt = `You write for PawBook, a cozy platform where street animals have names and stories.
Voice: warm, tender, storybook, never corporate or salesy. Never call the animal "it".
${{
		pov: "Write a short, cozy first-person diary entry (3-5 sentences) from the animal's own point of view.",
		story: "Write a tender storybook paragraph (4-6 sentences) about the animal in third person, dreamy and warm.",
		caption: "Write a short Instagram caption (max 220 characters) in the animal's voice, with 1-2 emojis.",
		adoption: "Write a gentle 4-sentence adoption story that makes readers care, without being manipulative."
	}[data.mode]}

Animal profile:
- Name: ${animal.name}
- Nickname: "${animal.nickname}"
- Bio: ${animal.bio}
- Personality: ${animal.personality}
- Home: ${animal.home}
- Favorite food: ${animal.favoriteFood}
- Current mood the reader wants: ${data.mood}

Return only the story text. No headings, no quotes around it.`;
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			[process.env.API_GATEWAY_KEY ? "Gateway-API-Key" : "Lovable-API-Key"]: key
		},
		body: JSON.stringify({
			model: "google/gemini-3-flash-preview",
			messages: [{
				role: "system",
				content: "You are the PawBook Story Weaver — a gentle, warm storyteller."
			}, {
				role: "user",
				content: prompt
			}]
		})
	});
	if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
	if (res.status === 402) throw new Error("AI credits ran out. Please add credits to keep the stories flowing.");
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`AI hiccup: ${t.slice(0, 180)}`);
	}
	const text = (await res.json()).choices?.[0]?.message?.content?.trim();
	if (!text) throw new Error("The story came back empty — try again.");
	return { text };
});
//#endregion
export { weaveStory_createServerFn_handler };
