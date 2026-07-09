import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DehiQiIM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as mapPlaces, c as spinRewards, d as useCMS, i as getAnimal, n as coco_default, s as quizQuestions, t as animals, u as updateCMSData } from "./pawbook-data-CqSvBvet.mjs";
import { g as Link, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as SectionHeading, r as useSession, t as PageShell } from "./SiteChrome-D0iB99sW.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { a as submitFoundFriend, n as createSsrRpc, o as useServerFn } from "./submissions.functions-BVJQlA9q.mjs";
import { n as SignedVideo, r as uploadToBucket, t as SignedImage } from "./SignedImage-Cs4AUWaF.mjs";
import { t as shareContent } from "./utils-CXLS34TX.mjs";
import { t as Route } from "./routes-oL028rtt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BT3UQc-D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var weaveStory = createServerFn({ method: "POST" }).inputValidator((input) => Input.parse(input)).handler(createSsrRpc("01186f47e847f7adfa0e2c3586c5bf1f47b59f007aaf699f531c7ec2c1a9dbdd"));
var resultsData = {
	coco: {
		name: "Coco",
		nickname: "The Friendly Tiger",
		emoji: "🐕",
		similarity: "98% Friendly Tiger Affinity",
		photo: coco_default,
		desc: "Both of you look big and powerful like a tiger, but you are just a big softie who wants to play! 🐯❤️"
	},
	moti: {
		name: "Moti",
		nickname: "Belly Rub Believer",
		emoji: "🐶",
		similarity: "99% Love Compatibility",
		photo: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400",
		desc: "You are pure warmth ❤️ You believe there is no such thing as too many belly rubs, and warm milk near a tea shop is heaven."
	},
	kitty: {
		name: "Kitty",
		nickname: "Rooftop Philosopher",
		emoji: "🐈",
		similarity: "95% Majestic Radiance",
		photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
		desc: "You are quiet, self-sufficient, and slightly royal 👑 You prefer sunbathing in silence and observing the world from above."
	},
	tommy: {
		name: "Tommy",
		nickname: "Little Adventurer",
		emoji: "🐕",
		similarity: "97% Energy Matching",
		photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
		desc: "You are a wild leaf-chaser 🧣 Rain showers don't scare you, and you're always ready to sprint after butterfly dreams!"
	}
};
function PetQuizModal({ forceOpen = false, onClose }) {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(0);
	const [selectedPets, setSelectedPets] = (0, import_react.useState)([]);
	const [match, setMatch] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (forceOpen) {
			setIsOpen(true);
			setStep(0);
			setSelectedPets([]);
			setMatch(null);
		} else if (!localStorage.getItem("pawbook-quiz-completed")) setIsOpen(true);
	}, [forceOpen]);
	const handleStart = () => {
		setStep(1);
		setSelectedPets([]);
	};
	const handleSelectOption = (pet) => {
		const nextAnswers = [...selectedPets, pet];
		setSelectedPets(nextAnswers);
		if (step < quizQuestions.length) setStep(step + 1);
		else {
			const counts = {};
			let maxCount = 0;
			let matchedPet = "coco";
			nextAnswers.forEach((p) => {
				counts[p] = (counts[p] || 0) + 1;
				if (counts[p] > maxCount) {
					maxCount = counts[p];
					matchedPet = p;
				}
			});
			setMatch(matchedPet);
			setStep(6);
		}
	};
	const claimReward = () => {
		if (!match) return;
		const treatsKey = `pawbook-extra-treats-${match}`;
		const currentTreats = parseInt(localStorage.getItem(treatsKey) || "0", 10);
		localStorage.setItem(treatsKey, (currentTreats + 1).toString());
		localStorage.setItem("pawbook-quiz-completed", "true");
		setIsOpen(false);
		if (onClose) onClose();
		const matchedName = resultsData[match].name;
		toast.success(`Matched! You gave a treat to ${matchedName}! 🍪`);
		navigate({
			to: "/paw-friends/$slug",
			params: { slug: match }
		});
	};
	const shareInstagram = () => {
		if (!match) return;
		const result = resultsData[match];
		shareContent({
			title: "Paw Match Quiz Results!",
			text: `🐾 I took the PawBook Quiz and matched with ${result.name} (${result.similarity})! \n"${result.desc}"`,
			url: window.location.origin
		}, () => toast.success("Match results shared / copied successfully! 🌟"), () => toast.error("Could not share automatically. Please share the URL from your browser address bar."));
	};
	const handleCloseModal = () => {
		setIsOpen(false);
		if (onClose) onClose();
	};
	if (!isOpen) return null;
	const currentQuestion = step >= 1 && step <= 5 ? quizQuestions[step - 1] : null;
	const result = step === 6 && match ? resultsData[match] : null;
	const petImg = (match ? animals.find((a) => a.slug === match) : null)?.image || (result ? result.photo : "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes paperDrop {
          0% { transform: translateY(-40px) scale(0.95); opacity: 0; }
          70% { transform: translateY(5px) scale(1.02); opacity: 0.95; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-paper-drop {
          animation: paperDrop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      ` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8 animate-paper-drop",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-1.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleCloseModal,
					className: "absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer",
					children: "✖"
				}),
				step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-5xl animate-bounce inline-block",
							children: "🐾"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl text-coffee",
							children: "Find Your Paw Best Friend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-coffee/80 leading-relaxed",
							children: "Answer 5 cute questions to find your matching soul friend in the village, claim a cookie reward, and share it on Instagram!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleStart,
							className: "squish w-full rounded-2xl bg-coffee py-3 text-sm font-bold text-cream scrapbook-shadow cursor-pointer",
							children: "Find My Match! 🐕🐾"
						})
					]
				}),
				currentQuestion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-coffee/50",
							children: [
								"Question ",
								step,
								" of 5"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-coffee leading-snug",
							children: currentQuestion.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 pt-2",
							children: currentQuestion.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleSelectOption(opt.pet),
								className: "flex items-center gap-3 w-full rounded-2xl border border-coffee/15 bg-white p-4 text-left font-semibold text-coffee hover:bg-cream/40 transition-all cursor-pointer animate-[fade-up_0.3s_ease-out_both]",
								style: { animationDelay: `${i * 75}ms` },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl",
									children: opt.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: opt.text
								})]
							}, i))
						})
					]
				}),
				step === 6 && result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-coffee/50",
							children: "You Matched With:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-[200px] border border-coffee/5 bg-cream/35 p-3 pb-6 shadow rotate-2 relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: petImg,
									alt: result.name,
									className: "h-32 w-full object-cover rounded bg-coffee/10 animate-pulse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-2xl mt-3",
									children: [
										result.name,
										" ",
										result.emoji
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-hand text-base text-peach mt-1",
									children: [
										"\"",
										result.nickname,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-2 -right-2 rounded-full bg-peach px-2 py-0.5 text-[8px] font-bold text-coffee uppercase shadow",
									children: result.similarity
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-coffee/80 px-2 leading-relaxed",
							children: result.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: claimReward,
									className: "squish w-full rounded-2xl bg-coffee py-3 text-sm font-bold text-cream scrapbook-shadow cursor-pointer",
									children: [
										"Claim Treat & Meet ",
										result.name,
										" 🍪"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: shareInstagram,
									className: "squish w-full rounded-2xl border-2 border-coffee bg-peach py-2.5 text-xs font-bold text-coffee hover:bg-peach/90 cursor-pointer",
									children: "📸 Share on Instagram Story"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep(0),
									className: "text-[10px] font-bold text-coffee/50 hover:text-peach transition-colors py-1 cursor-pointer",
									children: "Replay Quiz 🔄"
								})
							]
						})
					]
				})
			]
		})]
	});
}
function SpinWheel() {
	const canvasRef = (0, import_react.useRef)(null);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const segments = spinRewards;
	const [result, setResult] = (0, import_react.useState)(null);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const currentRotation = (0, import_react.useRef)(0);
	const spinSpeed = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		drawWheel();
	}, []);
	const drawWheel = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const size = canvas.width;
		const center = size / 2;
		const radius = center - 10;
		ctx.clearRect(0, 0, size, size);
		const angleStep = 2 * Math.PI / segments.length;
		segments.forEach((seg, i) => {
			const startAngle = i * angleStep + currentRotation.current;
			const endAngle = startAngle + angleStep;
			ctx.beginPath();
			ctx.moveTo(center, center);
			ctx.arc(center, center, radius, startAngle, endAngle);
			ctx.closePath();
			ctx.fillStyle = seg.color;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#4E3629";
			ctx.stroke();
			ctx.save();
			ctx.translate(center, center);
			ctx.rotate(startAngle + angleStep / 2);
			ctx.textAlign = "right";
			ctx.fillStyle = "#4E3629";
			ctx.font = "bold 12px sans-serif";
			ctx.fillText(`${seg.icon} ${seg.label.split(" ")[0]}`, radius - 15, 5);
			ctx.restore();
		});
		ctx.beginPath();
		ctx.arc(center, center, 15, 0, 2 * Math.PI);
		ctx.fillStyle = "#FFFDF9";
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#4E3629";
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center, center, 5, 0, 2 * Math.PI);
		ctx.fillStyle = "#FF6F61";
		ctx.fill();
	};
	const handleSpin = () => {
		if (spinning) return;
		setSpinning(true);
		setResult(null);
		spinSpeed.current = .3 + Math.random() * .2;
		const friction = .985;
		let tempRotation = currentRotation.current;
		let tempSpeed = spinSpeed.current;
		while (tempSpeed > .002) {
			tempRotation += tempSpeed;
			tempSpeed *= friction;
		}
		const angleStep = 2 * Math.PI / segments.length;
		const finalNormalized = (1.5 * Math.PI - tempRotation) % (2 * Math.PI);
		const positiveAngle = finalNormalized < 0 ? finalNormalized + 2 * Math.PI : finalNormalized;
		const matchedIndex = Math.floor(positiveAngle / angleStep) % segments.length;
		const matchedSegment = segments[matchedIndex];
		let frameId = 0;
		const animate = () => {
			currentRotation.current += spinSpeed.current;
			spinSpeed.current *= friction;
			drawWheel();
			if (spinSpeed.current > .002) frameId = requestAnimationFrame(animate);
			else {
				cancelAnimationFrame(frameId);
				setSpinning(false);
				setResult(matchedSegment);
				setModalOpen(true);
				toast.success(`You won: ${matchedSegment.label}! 🎡`);
			}
		};
		frameId = requestAnimationFrame(animate);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center p-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl mb-1 text-coffee",
				children: "Spin The Paw Wheel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-coffee/60 mb-5 max-w-sm",
				children: "Spin to discover rare memories, cozy dialogues, or secrets from College Street!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative inline-block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -top-3 left-1/2 z-10 -ml-3 text-2xl animate-bounce",
					children: "👇"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					width: 280,
					height: 280,
					className: "rounded-full border-4 border-coffee shadow-lg bg-cream"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleSpin,
				disabled: spinning,
				className: "mt-6 rounded-2xl bg-coffee px-6 py-2.5 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer",
				children: spinning ? "Spinning... 🎡" : "🎡 Spin the Wheel"
			}),
			modalOpen && result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-1.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setModalOpen(false),
							className: "absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer",
							children: "✖"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-5xl block my-3",
							children: result.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-coffee leading-snug",
							children: result.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-coffee/85 leading-relaxed bg-cream/40 rounded-2xl p-4 border border-coffee/5 font-hand text-xl",
							children: [
								"\"",
								result.content,
								"\""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setModalOpen(false),
							className: "mt-6 w-full rounded-xl bg-peach py-2 text-xs font-bold text-coffee hover:scale-105 transition-transform cursor-pointer",
							children: "Awesome! 🐾"
						})
					]
				})
			})
		]
	});
}
var storiesData = [
	{
		slug: "coco",
		name: "Coco",
		emoji: "🐕",
		avatar: coco_default,
		slides: [
			{
				image: coco_default,
				title: "Day 1: First Hello 🐯",
				desc: "Found Coco sitting under the garden tree. He looked big and powerful like a tiger, but as soon as we held out a treat, he wagged his tail and licked our hands! ❤️"
			},
			{
				image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=600",
				title: "Naughty Moment: The Flowerpot Hat 🌸",
				desc: "Coco chased a butterfly around the garden and ran directly into a hanging basket. Spent the afternoon wearing it like a hat."
			},
			{
				image: coco_default,
				title: "Favorite Thing: Treats 🎂",
				desc: "Coco is incredibly friendly and will happily sit, stand, or shake hands for dog-friendly birthday treat cake!"
			}
		]
	},
	{
		slug: "moti",
		name: "Moti",
		emoji: "🐶",
		avatar: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=150",
		slides: [
			{
				image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600",
				title: "Day 1: Safe & Sound ❤️",
				desc: "Moti was a tiny ball of fluff when he wandered into the lane. The local tea vendor gave him a cardboard bed and warm milk."
			},
			{
				image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=600",
				title: "Naughty Moment: Bed Blocker 😴",
				desc: "Moti once napped in front of the tea stall door for 4 hours. Customers had to step over him, but they left extra biscuits!"
			},
			{
				image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600",
				title: "Favorite Thing: Belly Rubs 🐾",
				desc: "Loves to flop onto his back the second you say hello. He believes belly rubs are a human's main duty."
			}
		]
	},
	{
		slug: "kitty",
		name: "Kitty",
		emoji: "🐈",
		avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150",
		slides: [
			{
				image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
				title: "Day 1: The Queen's Arrival 👑",
				desc: "Slipped into the library balcony silently. We didn't find her; she found us and claimed the balcony cushion."
			},
			{
				image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600",
				title: "Naughty Moment: Pigeon Hunter 🕊️",
				desc: "Stared at a pigeon on the tin roof for 6 hours without blinking. She didn't catch it, but the pigeon left out of anxiety."
			},
			{
				image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=600",
				title: "Favorite Thing: Balcony Sunbeams ☀️",
				desc: "Kitty sits in the square of warm sunlight. If the sunbeam moves across the floor, Kitty slowly slides with it."
			}
		]
	},
	{
		slug: "tommy",
		name: "Tommy",
		emoji: "🐕",
		avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
		slides: [
			{
				image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
				title: "Day 1: Tiny Monster 🍼",
				desc: "Found shivering in a monsoon puddle. A student picked him up and dried him with their favorite winter scarf."
			},
			{
				image: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=600",
				title: "Naughty Moment: Leaf Chase Chaos 🍃",
				desc: "Spotted running in circles chasing a leaf, got dizzy, and knocked over a stack of plastic tea cups. Oops!"
			},
			{
				image: "https://images.unsplash.com/photo-1477884213960-b131f91f914d?auto=format&fit=crop&q=80&w=600",
				title: "Favorite Thing: His Scarf 🧣",
				desc: "Tommy will not leave for a run without his red woolen scarf. He acts like a super-hero in it."
			}
		]
	}
];
function InstagramStories() {
	const [activeStoryIndex, setActiveStoryIndex] = (0, import_react.useState)(null);
	const [activeSlideIndex, setActiveSlideIndex] = (0, import_react.useState)(0);
	const closeStories = (0, import_react.useCallback)(() => {
		setActiveStoryIndex(null);
		setActiveSlideIndex(0);
	}, []);
	const handleNext = (0, import_react.useCallback)(() => {
		if (activeStoryIndex === null) return;
		const petStory = storiesData[activeStoryIndex];
		if (activeSlideIndex < petStory.slides.length - 1) setActiveSlideIndex(activeSlideIndex + 1);
		else if (activeStoryIndex < storiesData.length - 1) {
			setActiveStoryIndex(activeStoryIndex + 1);
			setActiveSlideIndex(0);
		} else closeStories();
	}, [
		activeStoryIndex,
		activeSlideIndex,
		closeStories
	]);
	const handlePrev = (0, import_react.useCallback)(() => {
		if (activeStoryIndex === null) return;
		if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1);
		else if (activeStoryIndex > 0) {
			setActiveStoryIndex(activeStoryIndex - 1);
			setActiveSlideIndex(storiesData[activeStoryIndex - 1].slides.length - 1);
		}
	}, [activeStoryIndex, activeSlideIndex]);
	(0, import_react.useEffect)(() => {
		if (activeStoryIndex === null) return;
		const timer = setTimeout(() => {
			handleNext();
		}, 4500);
		return () => clearTimeout(timer);
	}, [
		activeStoryIndex,
		activeSlideIndex,
		handleNext
	]);
	const openStory = (idx) => {
		setActiveStoryIndex(idx);
		setActiveSlideIndex(0);
		toast.success(`Opening ${storiesData[idx].name}'s diary... 📸`);
	};
	const activePetStory = activeStoryIndex !== null ? storiesData[activeStoryIndex] : null;
	const currentSlide = activePetStory ? activePetStory.slides[activeSlideIndex] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center gap-4 py-4 overflow-x-auto scrollbar-none",
			children: storiesData.map((pc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => openStory(idx),
				className: "flex flex-col items-center gap-1 focus:outline-none cursor-pointer group shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full p-[2.5px] bg-linear-to-tr from-yellow-500 via-peach to-pink-500 group-hover:scale-105 active:scale-95 transition-transform duration-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border-2 border-white bg-white p-px",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: pc.avatar,
							alt: pc.name,
							className: "size-16 rounded-full object-cover shrink-0"
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] font-bold text-coffee/85",
					children: [
						pc.name,
						" ",
						pc.emoji
					]
				})]
			}, pc.slug))
		}), activeStoryIndex !== null && activePetStory && currentSlide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in select-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-md h-full sm:h-[80vh] sm:rounded-3xl overflow-hidden bg-coffee flex flex-col justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-3 left-4 right-4 z-20 flex gap-1",
						children: activePetStory.slides.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 flex-1 bg-white/20 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full transition-all duration-300 " + (idx < activeSlideIndex ? "bg-white w-full" : idx === activeSlideIndex ? "bg-white animate-story-progress" : "bg-white/0 w-0"),
								style: { animationDuration: idx === activeSlideIndex ? "4.5s" : "0s" }
							})
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-7 left-4 right-4 z-20 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: activePetStory.avatar,
								alt: "",
								className: "size-9 rounded-full object-cover border-2 border-white"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-white text-xs font-bold font-display",
								children: [
									activePetStory.name,
									" ",
									activePetStory.emoji
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[9px] text-white/60",
								children: [
									"@",
									activePetStory.slug,
									"_diaries"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: closeStories,
							className: "h-8 w-8 rounded-full bg-black/45 text-white flex items-center justify-center font-bold text-sm hover:bg-black/60 cursor-pointer",
							children: "✖"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer",
						onClick: handlePrev
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer",
						onClick: handleNext
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full flex-1 bg-coffee/80 flex items-center justify-center relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: currentSlide.image,
							alt: "",
							className: "w-full h-full object-cover sm:rounded-t-3xl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/50" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-black/85 text-cream z-20 space-y-2 border-t border-white/10 select-text",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg text-peach",
								children: currentSlide.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-cream/80 leading-relaxed font-hand text-lg",
								children: [
									"\"",
									currentSlide.desc,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										toast.success(`You booped ${activePetStory.name}! ❤️`);
									},
									className: "rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold hover:bg-white/20 active:scale-95 transition-transform cursor-pointer",
									children: "❤️ Send Love"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-white/40 uppercase tracking-wider",
									children: "Tap sides to navigate"
								})]
							})
						]
					})
				]
			})
		})]
	});
}
var audioCtx = null;
function getAudioContext() {
	if (typeof window === "undefined") return null;
	if (!audioCtx) {
		const WinAudioContext = window.webkitAudioContext;
		const AudioContextClass = window.AudioContext || WinAudioContext;
		if (AudioContextClass) audioCtx = new AudioContextClass();
	}
	if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
	return audioCtx;
}
function playPop() {
	const ctx = getAudioContext();
	if (!ctx) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.type = "sine";
	osc.frequency.setValueAtTime(450, ctx.currentTime);
	osc.frequency.exponentialRampToValueAtTime(1e3, ctx.currentTime + .08);
	gain.gain.setValueAtTime(.12, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(.005, ctx.currentTime + .08);
	osc.start();
	osc.stop(ctx.currentTime + .08);
}
function playRustle() {
	const ctx = getAudioContext();
	if (!ctx) return;
	const bufferSize = ctx.sampleRate * .15;
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
	const noiseNode = ctx.createBufferSource();
	noiseNode.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.setValueAtTime(1200, ctx.currentTime);
	filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + .15);
	const gain = ctx.createGain();
	gain.gain.setValueAtTime(.06, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .15);
	noiseNode.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);
	noiseNode.start();
}
function playBark() {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.type = "sawtooth";
	osc.frequency.setValueAtTime(160, now);
	osc.frequency.exponentialRampToValueAtTime(90, now + .13);
	gain.gain.setValueAtTime(.12, now);
	gain.gain.exponentialRampToValueAtTime(.001, now + .13);
	osc.start(now);
	osc.stop(now + .13);
}
function playMeow() {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	const osc1 = ctx.createOscillator();
	const osc2 = ctx.createOscillator();
	const gain = ctx.createGain();
	osc1.connect(gain);
	osc2.connect(gain);
	gain.connect(ctx.destination);
	osc1.type = "sine";
	osc2.type = "triangle";
	osc1.frequency.setValueAtTime(450, now);
	osc1.frequency.exponentialRampToValueAtTime(800, now + .08);
	osc1.frequency.exponentialRampToValueAtTime(600, now + .26);
	osc2.frequency.setValueAtTime(455, now);
	osc2.frequency.exponentialRampToValueAtTime(805, now + .08);
	osc2.frequency.exponentialRampToValueAtTime(605, now + .26);
	gain.gain.setValueAtTime(.05, now);
	gain.gain.linearRampToValueAtTime(.07, now + .06);
	gain.gain.exponentialRampToValueAtTime(.001, now + .26);
	osc1.start(now);
	osc2.start(now);
	osc1.stop(now + .26);
	osc2.stop(now + .26);
}
var orbitClasses = [
	{
		top: "0%",
		left: "10%",
		delay: "0s",
		size: "w-20 h-20"
	},
	{
		top: "10%",
		right: "0%",
		delay: "-1s",
		size: "w-16 h-16"
	},
	{
		bottom: "5%",
		right: "10%",
		delay: "-2s",
		size: "w-20 h-20"
	},
	{
		bottom: "15%",
		left: "0%",
		delay: "-3s",
		size: "w-16 h-16"
	}
];
function HomePage() {
	const router = useRouter();
	const { approved } = Route.useLoaderData();
	const { animals, memories } = useCMS();
	const [featuredSlug, setFeaturedSlug] = (0, import_react.useState)("coco");
	const [quizOpen, setQuizOpen] = (0, import_react.useState)(false);
	const parseHelpBoardItem = (r) => {
		const storyStr = r.story || "";
		const typeMatch = storyStr.match(/\[type:([^\]]+)\]/);
		const statusMatch = storyStr.match(/\[status:([^\]]+)\]/);
		return {
			needType: typeMatch ? typeMatch[1] : "Just sharing memory",
			needStatus: statusMatch ? statusMatch[1] : "open",
			cleanStory: storyStr.replace(/\[type:[^\]]+\]/g, "").replace(/\[status:[^\]]+\]/g, "").trim()
		};
	};
	const handleHelpItem = async (friend) => {
		const { needStatus } = parseHelpBoardItem(friend);
		let nextStatus = "helping";
		if (needStatus === "helping") nextStatus = "resolved";
		else if (needStatus === "resolved") nextStatus = "open";
		let updatedStory = friend.story;
		if (updatedStory.includes("[status:")) updatedStory = updatedStory.replace(/\[status:[^\]]+\]/, `[status:${nextStatus}]`);
		else updatedStory = `${updatedStory} [status:${nextStatus}]`;
		try {
			const { error } = await supabase.from("found_friends").update({ story: updatedStory }).eq("id", friend.id);
			if (error) throw error;
			toast.success(`Status updated to: ${nextStatus === "helping" ? "Someone Helping 🟡" : "Help Completed 💚"}`);
			router.invalidate();
		} catch (err) {
			const saved = localStorage.getItem("pawbook-local-submissions");
			if (saved) {
				const updatedLocal = JSON.parse(saved).map((item) => {
					if (item.id === friend.id) {
						let story = item.story;
						if (story.includes("[status:")) story = story.replace(/\[status:[^\]]+\]/, `[status:${nextStatus}]`);
						else story = `${story} [status:${nextStatus}]`;
						return {
							...item,
							story
						};
					}
					return item;
				});
				localStorage.setItem("pawbook-local-submissions", JSON.stringify(updatedLocal));
				window.dispatchEvent(new Event("pawbook-local-sub-updated"));
				toast.success(`Local post updated to: ${nextStatus === "helping" ? "Someone Helping 🟡" : "Help Completed 💚"}`);
			}
		}
	};
	const [isFlipped, setIsFlipped] = (0, import_react.useState)(false);
	const [currentBookPage, setCurrentBookPage] = (0, import_react.useState)(0);
	const [isBookFlipping, setIsBookFlipping] = (0, import_react.useState)(false);
	const [flipDirection, setFlipDirection] = (0, import_react.useState)("next");
	const [flippedSlugs, setFlippedSlugs] = (0, import_react.useState)({});
	const toggleFlip = (slug, e) => {
		e.preventDefault();
		e.stopPropagation();
		setFlippedSlugs((prev) => ({
			...prev,
			[slug]: !prev[slug]
		}));
	};
	(0, import_react.useEffect)(() => {
		setIsFlipped(false);
	}, [featuredSlug]);
	const featured = animals.find((a) => a.slug === featuredSlug) ?? animals[0];
	const others = animals.filter((a) => a.slug !== featured.slug);
	const [extraLove, setExtraLove] = (0, import_react.useState)({});
	const [extraTreats, setExtraTreats] = (0, import_react.useState)({});
	const [likes, setLikes] = (0, import_react.useState)({});
	const [newCommentAuthor, setNewCommentAuthor] = (0, import_react.useState)("");
	const [newCommentText, setNewCommentText] = (0, import_react.useState)("");
	const [mapFilter, setMapFilter] = (0, import_react.useState)("all");
	const handleAddComment = async (memoryId) => {
		if (!newCommentAuthor.trim() || !newCommentText.trim()) {
			toast.error("Please enter your name and comment!");
			return;
		}
		await updateCMSData({ memories: memories.map((mem) => {
			if (mem.id === memoryId) {
				const existingComments = mem.comments || [];
				return {
					...mem,
					comments: [...existingComments, {
						id: `c-${Date.now()}`,
						author: newCommentAuthor.trim(),
						text: newCommentText.trim(),
						date: (/* @__PURE__ */ new Date()).toLocaleDateString()
					}]
				};
			}
			return mem;
		}) });
		setNewCommentText("");
		toast.success("Kind comment added to memory! ❤️");
	};
	const [activePlayroomIndex, setActivePlayroomIndex] = (0, import_react.useState)(0);
	const handlePlayroomScroll = (e) => {
		const target = e.currentTarget;
		const scrollLeft = target.scrollLeft;
		const children = target.children;
		if (children.length > 0) {
			const cardWidth = children[0].clientWidth + 24;
			const index = Math.round(scrollLeft / cardWidth);
			setActivePlayroomIndex(Math.min(Math.max(0, index), 2));
		}
	};
	const [actionParticles, setActionParticles] = (0, import_react.useState)([]);
	const handleAction = (memoryId, type, animalName, e) => {
		setLikes((prev) => ({
			...prev,
			[memoryId]: (prev[memoryId] || 0) + 1
		}));
		const emoji = {
			Boop: "❤️",
			Treat: "🍪",
			Hug: "🐾"
		}[type] || "✨";
		toast.success(`${type} sent! ${animalName} received your love ${emoji}`);
		if (animalName.toLowerCase().includes("kitty")) playMeow();
		else playBark();
		if (e) {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top;
			const newParticles = Array.from({ length: 4 }).map((_, i) => ({
				id: Date.now() + i,
				x: x + (Math.random() * 30 - 15),
				y: y - 5,
				emoji
			}));
			setActionParticles((prev) => [...prev, ...newParticles]);
			setTimeout(() => {
				setActionParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
			}, 2e3);
		}
	};
	(0, import_react.useEffect)(() => {
		const love = {};
		const treats = {};
		animals.forEach((a) => {
			love[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-love-${a.slug}`) || "0", 10);
			treats[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-treats-${a.slug}`) || "0", 10);
		});
		setExtraLove(love);
		setExtraTreats(treats);
	}, [animals]);
	(0, import_react.useEffect)(() => {
		const handleMouseMove = (e) => {
			if (Math.random() > .08) return;
			const trail = document.createElement("div");
			trail.className = "pointer-events-none fixed z-50 text-base select-none transition-all duration-700 opacity-60";
			trail.innerText = "🐾";
			trail.style.left = `${e.clientX}px`;
			trail.style.top = `${e.clientY}px`;
			const rot = Math.random() * 40 - 20;
			trail.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.8)`;
			document.body.appendChild(trail);
			setTimeout(() => {
				trail.style.opacity = "0";
				trail.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.2) translateY(10px)`;
			}, 50);
			setTimeout(() => {
				trail.remove();
			}, 700);
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && window.location.hash) {
			const hash = window.location.hash.substring(1);
			setTimeout(() => {
				const el = document.getElementById(hash);
				if (el) el.scrollIntoView({ behavior: "smooth" });
			}, 300);
		}
	}, []);
	const [localSubmissions, setLocalSubmissions] = (0, import_react.useState)([]);
	const loadLocalSubmissions = () => {
		const saved = localStorage.getItem("pawbook-local-submissions");
		if (saved) try {
			setLocalSubmissions(JSON.parse(saved));
		} catch (e) {
			console.error(e);
		}
	};
	const [kindnessPosts, setKindnessPosts] = (0, import_react.useState)([]);
	const [newKindnessAuthor, setNewKindnessAuthor] = (0, import_react.useState)("");
	const [newKindnessText, setNewKindnessText] = (0, import_react.useState)("");
	const [newKindnessBadge, setNewKindnessBadge] = (0, import_react.useState)("Food Friend 🍲");
	const [kindnessPoints, setKindnessPoints] = (0, import_react.useState)(120);
	const handleSubmitKindness = (e) => {
		e.preventDefault();
		if (!newKindnessAuthor.trim() || !newKindnessText.trim()) return;
		const updated = [{
			id: `kp-${Date.now()}`,
			author: newKindnessAuthor.trim(),
			text: newKindnessText.trim(),
			badge: newKindnessBadge,
			date: "Just now",
			points: 10
		}, ...kindnessPosts];
		setKindnessPosts(updated);
		localStorage.setItem("pawbook-kindness-posts", JSON.stringify(updated));
		const nextPoints = kindnessPoints + 10;
		setKindnessPoints(nextPoints);
		localStorage.setItem("pawbook-kindness-points", nextPoints.toString());
		setNewKindnessAuthor("");
		setNewKindnessText("");
		toast.success("Kindness registered! You earned +10 Kindness Points! 🎉");
	};
	(0, import_react.useEffect)(() => {
		loadLocalSubmissions();
		window.addEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
		const savedPosts = localStorage.getItem("pawbook-kindness-posts");
		if (savedPosts) try {
			setKindnessPosts(JSON.parse(savedPosts));
		} catch (e) {
			console.error(e);
		}
		else {
			const defaults = [
				{
					id: "kp1",
					author: "Sejal",
					text: "Shared biscuits with Moti near College Gate today!",
					badge: "Food Friend 🍲",
					date: "Just now",
					points: 10
				},
				{
					id: "kp2",
					author: "Aarav",
					text: "Cleaned Tommy's outdoor shelter and checked on his bandage.",
					badge: "Care Hero 🏥",
					date: "3 hours ago",
					points: 10
				},
				{
					id: "kp3",
					author: "Sneha",
					text: "Uploaded Coco's cute childhood photos to the digital memory book.",
					badge: "Memory Keeper 📖",
					date: "1 day ago",
					points: 10
				}
			];
			setKindnessPosts(defaults);
			localStorage.setItem("pawbook-kindness-posts", JSON.stringify(defaults));
		}
		const savedPoints = localStorage.getItem("pawbook-kindness-points");
		if (savedPoints) setKindnessPoints(parseInt(savedPoints, 10));
		return () => {
			window.removeEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
		};
	}, []);
	const allSubmissions = [...localSubmissions, ...approved];
	const totalMemories = memories.length;
	const [flowerStates, setFlowerStates] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("pawbook-flower-states");
			if (saved) try {
				return JSON.parse(saved);
			} catch (e) {
				console.error(e);
			}
		}
		return {};
	});
	const [beeParticles, setBeeParticles] = (0, import_react.useState)([]);
	const handleFlowerClick = (index, e) => {
		const flowerList = [
			"🌸",
			"🌻",
			"🌼",
			"🌺",
			"🌷",
			"🌹",
			"🏵️",
			"💮",
			"🦄",
			"🌈"
		];
		const currentEmoji = flowerStates[index] || [
			"🌸",
			"🌻",
			"🌼",
			"🌺",
			"🌷"
		][index % 5];
		const nextEmoji = flowerList[(flowerList.indexOf(currentEmoji) + 1) % flowerList.length];
		setFlowerStates((prev) => {
			const next = {
				...prev,
				[index]: nextEmoji
			};
			localStorage.setItem("pawbook-flower-states", JSON.stringify(next));
			return next;
		});
		playPop();
		const rect = e.currentTarget.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top;
		const newBees = Array.from({ length: 3 }).map((_, i) => ({
			id: Date.now() + i,
			x: x + (Math.random() * 40 - 20),
			y: y - 10,
			delay: i * 200
		}));
		setBeeParticles((prev) => [...prev, ...newBees]);
		setTimeout(() => {
			setBeeParticles((prev) => prev.filter((b) => !newBees.find((nb) => nb.id === b.id)));
		}, 2500);
		const messages = [
			"A seed of kindness has sprouted! 🌱",
			"Love is blooming in the meadow! 🌸",
			"You grew a gorgeous flower! 🌻",
			"Your treat to Coco grew this daisy! 🍪",
			"A butterfly sat on your flower! 🦋",
			"The meadow is glowing with colors! 🌈"
		];
		toast.success(messages[index % messages.length]);
	};
	const totalLove = animals.reduce((s, a) => s + a.stats.pawPrints, 0);
	const totalTreats = animals.reduce((s, a) => s + a.stats.treats, 0);
	const growth = totalMemories >= 100 ? {
		label: "Paw Forest 🌲",
		desc: "The village has grown into a full forest of memories."
	} : totalMemories >= 50 ? {
		label: "Rainbow 🌈",
		desc: "The garden is glowing with color today."
	} : totalMemories >= 10 ? {
		label: "A big tree 🌳",
		desc: "Your kindness has grown a whole tree."
	} : {
		label: "A little flower 🌸",
		desc: "Every memory adds another petal."
	};
	const [exploreTab, setExploreTab] = (0, import_react.useState)("map");
	const [foundPlaceAnimal, setFoundPlaceAnimal] = (0, import_react.useState)(null);
	const mapAnimal = foundPlaceAnimal ? getAnimal(foundPlaceAnimal) : null;
	const weave = useServerFn(weaveStory);
	const [weaverSlug, setWeaverSlug] = (0, import_react.useState)(animals[0]?.slug || "coco");
	(0, import_react.useEffect)(() => {
		if (animals.length > 0) setWeaverSlug(animals[0].slug);
	}, [animals]);
	const [weaverMode, setWeaverMode] = (0, import_react.useState)("pov");
	const [weaverMood, setWeaverMood] = (0, import_react.useState)("happy");
	const [weaverResult, setWeaverResult] = (0, import_react.useState)("");
	const [weaverLoading, setWeaverLoading] = (0, import_react.useState)(false);
	const [weaverError, setWeaverError] = (0, import_react.useState)(null);
	const [isReunion, setIsReunion] = (0, import_react.useState)(false);
	const [playerName, setPlayerName] = (0, import_react.useState)("");
	const [showCertificate, setShowCertificate] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			if (new URLSearchParams(window.location.search).get("reunion") === "true") {
				setIsReunion(true);
				setExploreTab("weaver");
				setWeaverResult("Click the Weave Reunion button to gather the village friends! 🌟");
			}
		}
	}, []);
	async function onWeaveGenerate() {
		setWeaverLoading(true);
		setWeaverError(null);
		setWeaverResult("");
		try {
			if (isReunion) {
				await new Promise((r) => setTimeout(r, 1200));
				setWeaverResult(`It was a perfect afternoon in the flower meadow. Coco arrived first, looking like a tiger but wagging his tail too friendly. Moti trotted in next, wagging his tail happily. Kitty watched them gracefully from the low branch of a mango tree, and Tommy came sprinting through the grass chasing a yellow butterfly. For the first time, all four friends shared a sunny spot together under the warm sky, happy to be part of the same loving village. 💮🐕🐶🐈🎒🍪`);
				setShowCertificate(true);
			} else {
				const res = await weave({ data: {
					animalSlug: weaverSlug,
					mode: weaverMode,
					mood: weaverMood
				} });
				setWeaverResult(res.text);
			}
		} catch (e) {
			setWeaverError(e instanceof Error ? e.message : "Something went wrong. Try again.");
		} finally {
			setWeaverLoading(false);
		}
	}
	const currentWeaveAnimal = animals.find((a) => a.slug === weaverSlug) || animals[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "home",
			className: "scroll-mt-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-5xl px-4 pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstagramStories, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-10 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 lg:space-y-8",
						style: { animation: "fade-up 0.9s var(--ease-soft) both" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] scrapbook-shadow",
								children: "🐾 Welcome to PawBook World"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-4xl leading-[1.05] text-balance sm:text-5xl md:text-6xl lg:text-7xl",
								children: [
									"Every street friend has a",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-peach",
										children: "story worth remembering 🐾"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-md text-base leading-relaxed text-coffee/85 sm:text-lg",
								children: "Create memories, follow journeys, and celebrate the little paws that make our streets feel like home."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-row gap-3 pt-2 sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => document.getElementById("paw-book")?.scrollIntoView({ behavior: "smooth" }),
									className: "squish flex-1 sm:flex-initial rounded-2xl bg-coffee px-4 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold text-cream scrapbook-shadow cursor-pointer text-center",
									children: "🐶 Meet Paw Friends"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => document.getElementById("found-friends")?.scrollIntoView({ behavior: "smooth" }),
									className: "squish flex-1 sm:flex-initial rounded-2xl border-2 border-coffee/10 bg-white px-4 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold text-coffee cursor-pointer text-center hover:bg-cream/60",
									children: "❤️ Share a Paw Moment"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 pt-4 max-w-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#fefae0] border border-coffee/10 p-3 rounded-2xl -rotate-2 scrapbook-shadow text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl",
												children: "🐾"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-base font-bold text-coffee mt-1",
												children: [animals.length, " Friends"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] text-coffee/60 font-bold uppercase tracking-wider",
												children: "Paw Friends Added"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#fcf3ef] border border-coffee/10 p-3 rounded-2xl rotate-[1.5deg] scrapbook-shadow text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl",
												children: "❤️"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-base font-bold text-coffee mt-1",
												children: [memories.length, " Saved"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] text-coffee/60 font-bold uppercase tracking-wider",
												children: "Memories Saved"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#e8f0fe] border border-coffee/10 p-3 rounded-2xl rotate-1 scrapbook-shadow text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl",
												children: "🍲"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold text-coffee mt-1",
												children: "420 Shared"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] text-coffee/60 font-bold uppercase tracking-wider",
												children: "Meals Shared"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#e6f4ea] border border-coffee/10 p-3 rounded-2xl rotate-[-1.5deg] scrapbook-shadow text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl",
												children: "🏥"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold text-coffee mt-1",
												children: "94 Care"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] text-coffee/60 font-bold uppercase tracking-wider",
												children: "Care Moments"
											})
										]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-[520px] items-center justify-center sm:h-[560px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0",
							children: others.map((a, i) => {
								const pos = orbitClasses[i % orbitClasses.length];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFeaturedSlug(a.slug),
									className: `pointer-events-auto group absolute ${pos.size} animate-floaty overflow-hidden rounded-full border-4 border-white bg-${a.color} scrapbook-shadow cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-3 hover:paused`,
									style: {
										top: pos.top,
										left: pos.left,
										right: pos.right,
										bottom: pos.bottom,
										animationDelay: pos.delay
									},
									"aria-label": `Feature ${a.name}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: a.image,
										alt: a.name,
										className: "h-full w-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute inset-x-0 bottom-1 mx-auto w-fit rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100",
										children: a.name
									})]
								}, a.slug);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 w-full max-w-sm h-[560px] perspective-1000 animate-sway",
							style: { animation: "sway 6s ease-in-out infinite, fade-up 0.6s var(--ease-soft) both" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => {
									setIsFlipped(!isFlipped);
									playRustle();
								},
								className: `w-full h-full transform-style-3d transition-all duration-500 ease-soft relative cursor-pointer hover:-translate-y-1 ${isFlipped ? "rotate-y-180" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 w-full h-full backface-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative -rotate-2 border border-coffee/5 bg-white p-4 pb-7 scrapbook-shadow h-full flex flex-col justify-between",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-3 left-1/2 z-20 h-8 w-24 -translate-x-1/2 rotate-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative aspect-square overflow-hidden rounded-sm bg-cream shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetPhoto, {
													slug: featured.slug,
													image: featured.image
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute right-3 bottom-3 flex flex-wrap justify-end gap-2",
													children: featured.badges.slice(0, 2).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-yellow/90 px-3 py-1 text-[10px] font-bold shadow-sm",
														children: b
													}, b))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex-1 flex flex-col justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-end justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
															className: "font-display text-2xl",
															children: [
																featured.name,
																" ",
																featured.emoji
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-hand text-lg text-peach",
															children: [
																"\"",
																featured.nickname,
																"\""
															]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "shrink-0 text-right",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] font-bold uppercase tracking-widest text-coffee/40",
															children: "Status"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "flex items-center justify-end gap-1 font-bold text-sage",
															children: [
																"●",
																" ",
																featured.status === "safe" ? "Safe" : featured.status === "needs-care" ? "Needs care" : "Emergency"
															]
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "rounded-lg bg-cream/60 p-2.5 text-xs italic leading-relaxed text-coffee/70 mt-2",
													children: [
														"\"",
														featured.story,
														"\""
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-3 pt-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "grid grid-cols-3 gap-2",
														children: [
															{
																v: featured.stats.pawPrints,
																l: "Paw Prints"
															},
															{
																v: featured.stats.treats,
																l: "Treats"
															},
															{
																v: featured.stats.memories,
																l: "Memories"
															}
														].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded bg-cream p-1.5 text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-sm font-bold",
																children: s.v
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[8px] uppercase tracking-tight text-coffee/60",
																children: s.l
															})]
														}, s.l))
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-center text-[10px] font-bold text-coffee/40 animate-pulse",
														children: "🖱️ Tap card to reveal secret facts! ✨"
													})]
												})]
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative rotate-2 border-2 border-coffee/10 bg-cream/95 p-5 pb-7 scrapbook-shadow h-full flex flex-col justify-between text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-3 left-1/2 z-20 h-8 w-24 -translate-x-1/2 rotate-1" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between border-b border-coffee/10 pb-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
													className: "font-display text-2xl text-coffee",
													children: [featured.name, "'s Secrets 🤫"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-coffee/40 font-bold uppercase tracking-wider",
													children: "Creator Files"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-3xl",
													children: featured.emoji
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 space-y-3.5 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-baseline border-b border-coffee/5 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/50 uppercase text-[9px] tracking-wider",
															children: "Official Title"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee",
															children: featured.nickname
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "block border-b border-coffee/5 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/50 uppercase text-[9px] tracking-wider block mb-0.5",
															children: "Secret Weakness / Habit"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium text-coffee italic",
															children: "\"Acts hungry even after eating a full meal\" 🍪"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-baseline border-b border-coffee/5 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/50 uppercase text-[9px] tracking-wider",
															children: "Favorite Snack"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee",
															children: featured.favoriteFood || "Parle-G Biscuits"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-baseline border-b border-coffee/5 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/50 uppercase text-[9px] tracking-wider",
															children: "First Met Date"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee",
															children: featured.firstMet || "12 Jan 2025"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-baseline border-b border-coffee/5 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/50 uppercase text-[9px] tracking-wider",
															children: "Primary Basecamp"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee",
															children: featured.home
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-baseline border-b border-coffee/5 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/50 uppercase text-[9px] tracking-wider",
															children: "Personality Tag"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-peach",
															children: featured.personality
														})]
													})
												]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-2",
														onClick: (e) => e.stopPropagation(),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: (e) => handleAction("feat-love", "Boop", featured.name, e),
															className: "squish flex-1 rounded-xl bg-peach py-2 text-xs font-bold text-coffee scrapbook-shadow cursor-pointer",
															children: "❤️ Boop Nose"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: (e) => handleAction("feat-treat", "Treat", featured.name, e),
															className: "squish flex-1 rounded-xl bg-sage py-2 text-xs font-bold text-coffee scrapbook-shadow cursor-pointer",
															children: "🍪 Give Cookie"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/paw-friends/$slug",
														params: { slug: featured.slug },
														onClick: (e) => e.stopPropagation(),
														className: "block rounded-xl bg-coffee py-2.5 text-center text-xs font-bold text-cream transition hover:opacity-90",
														children: "Explore Full Pet Diary & Timeline →"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-center text-[9px] font-bold text-coffee/30",
														children: "🖱️ Click card to return profile"
													})
												]
											})
										]
									})
								})]
							})
						}, featured.slug)]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-7xl px-6 py-12 border-t border-b border-coffee/5 bg-cream/10 rounded-3xl mb-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							eyebrow: "Updates & Interactive Playroom",
							title: "🐾 The Paw Playroom & Board"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 mb-10 p-5 rounded-3xl border border-coffee/10 bg-white/70 backdrop-blur-md scrapbook-shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-bold uppercase tracking-widest text-coffee/50 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today's Updates 🐾" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-peach animate-ping" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-coffee/40 font-bold uppercase",
									children: "Status Stories"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x",
								children: animals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 shrink-0 snap-center bg-[#FDFBF7]/60 border border-coffee/5 rounded-2xl p-2 pr-4 shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative size-12 rounded-full border-2 border-peach overflow-hidden shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: a.image,
											alt: a.name,
											className: "h-full w-full object-cover"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-bold text-coffee flex items-center gap-1",
										children: [
											a.name,
											" ",
											a.emoji,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] text-coffee/40 font-normal",
												children: ["· ", a.lastUpdated]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-coffee/85 italic",
										children: [
											"\"",
											a.dailyThought.slice(0, 45),
											"...\""
										]
									})] })]
								}, a.slug))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: "playroom-container",
							onScroll: handlePlayroomScroll,
							className: "mt-4 flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0 items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between overflow-hidden animate-[fade-up_0.5s_ease-out_both]",
									style: { animationDelay: "100ms" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center w-full",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-4xl block my-2",
													children: "📝"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display text-2xl mb-1 text-coffee",
													children: "Daily Thoughts"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-coffee/60 mb-4 max-w-xs mx-auto",
													children: [
														"What is on ",
														featured.name,
														"'s mind today?"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 flex items-center justify-center p-3 my-2 relative",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-[#fefae0] border border-coffee/10 p-5 rounded-2xl -rotate-2 scrapbook-shadow text-center max-w-[280px] relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-peach/30 border border-coffee/5" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "font-hand text-base text-coffee/95 leading-relaxed",
														children: [
															"\"",
															featured.dailyThought || `Today my friends visited again. The treats were nice, but the head pats were better ❤️`,
															"\""
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[9px] text-coffee/50 font-bold uppercase mt-4",
														children: [
															"— ",
															featured.name,
															" ",
															featured.emoji
														]
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: (e) => {
												handleAction("thought-love", "Boop", featured.name, e);
												toast.success(`You sent a heart to ${featured.name}! ❤️`);
											},
											className: "squish w-full rounded-2xl bg-peach py-3 text-sm font-bold text-coffee border border-coffee/5 scrapbook-shadow cursor-pointer mt-auto",
											children: "Send a Heart ❤️🐾"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between overflow-hidden animate-[fade-up_0.5s_ease-out_both]",
									style: { animationDelay: "200ms" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center w-full",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-4xl block my-2",
													children: "🏥"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display text-2xl mb-1 text-coffee",
													children: "Upcoming Care"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-coffee/60 mb-4 max-w-xs mx-auto",
													children: "Keep track of vaccination due dates and veterinary checkups."
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 overflow-y-auto space-y-3 my-2 pr-1 text-left scrollbar-none",
											children: animals.map((a) => {
												return (a.healthRecords || []).map((r, i) => ({
													id: `${a.slug}-rem-${i}`,
													petName: a.name,
													emoji: a.emoji,
													type: r.type === "Vaccination" ? "💉" : r.type === "Checkup" ? "🏥" : r.type === "Medicine" ? "💊" : "🩹",
													label: `${a.name}'s ${r.type}`,
													note: r.note,
													dueDate: r.date
												})).slice(0, 1).map((rem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bg-cream/40 border border-coffee/5 p-3 rounded-2xl flex gap-3 items-start shadow-3xs animate-fade-in",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg mt-0.5",
														children: rem.type
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs font-bold text-coffee",
															children: rem.label
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] text-coffee/70",
															children: rem.note
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[9px] text-peach font-bold uppercase mt-1",
															children: ["Due Date: ", rem.dueDate]
														})
													] })]
												}, rem.id));
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-cream/40 border border-coffee/5 rounded-2xl p-2.5 text-center text-[9px] text-coffee/50 mt-auto",
											children: "💡 Reminders are updated automatically from health records."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between items-center overflow-hidden animate-[fade-up_0.5s_ease-out_both]",
									style: { animationDelay: "280ms" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinWheel, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow text-center flex flex-col justify-between h-[545px] overflow-hidden animate-[fade-up_0.5s_ease-out_both]",
									style: { animationDelay: "350ms" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-6xl block my-4 animate-bounce",
											children: "🐾"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-2xl mb-2 text-coffee",
											children: "Find Your Paw Best Friend"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-coffee/70 max-w-xs mx-auto leading-relaxed",
											children: "Take our viral 5-question personality matching game to find out which street friend shares your soul energy!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-6 space-y-2 bg-cream/30 p-4 rounded-2xl border border-coffee/5 text-left max-w-xs mx-auto",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Matched Affinity:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-coffee/85",
													children: "🐯 Coco (Friendly Tiger) - 98% Affinity"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-coffee/85",
													children: "❤️ Moti (Belly Rub Believer) - 99% Love"
												})
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQuizOpen(true),
										className: "squish w-full rounded-2xl bg-[#fcf3ef] hover:bg-peach py-3 text-sm font-bold text-coffee scrapbook-shadow cursor-pointer mt-auto border border-coffee/5",
										children: "Play Match Quiz 🎮🐾"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2 mt-4 md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: [
									0,
									1,
									2,
									3
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										const el = document.getElementById("playroom-container");
										if (el) {
											const children = el.children;
											if (children[i]) children[i].scrollIntoView({
												behavior: "smooth",
												block: "nearest",
												inline: "center"
											});
										}
									},
									className: `h-2 rounded-full transition-all duration-300 ${activePlayroomIndex === i ? "w-6 bg-coffee scale-x-110" : "w-2 bg-coffee/20"} cursor-pointer`,
									"aria-label": `Go to game ${i + 1}`
								}, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-wider text-coffee/30 animate-pulse mt-1",
								children: "Swipe left / right to play other games 🐾"
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "paw-book",
			className: "mx-auto max-w-7xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50",
					children: "🐾 The Village"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-4xl sm:text-5xl md:text-6xl",
					children: ["Meet the ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-peach",
						children: "PawBook Friends"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-lg text-coffee/70",
					children: "Every card here is a real little life. Tap a friend's card to flip it and see their community love stats, or explore their full passport and diary."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: animals.map((a, i) => {
						const rot = i === 0 ? "-rotate-1 translate-x-1" : i === 1 ? "rotate-1 -translate-x-1" : i === 2 ? "rotate-2 translate-y-1" : "-rotate-2 -translate-y-1";
						const isFlipped = !!flippedSlugs[a.slug];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							onClick: (e) => toggleFlip(a.slug, e),
							className: `relative w-full h-[390px] perspective-1000 cursor-pointer select-none ${rot} group`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-coffee/10 bg-white p-3 pb-5 flex flex-col justify-between scrapbook-shadow z-10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3.5 left-1/2 z-20 h-6 w-16 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-full aspect-square overflow-hidden rounded-2xl bg-cream border border-coffee/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetPhoto, {
												slug: a.slug,
												image: a.image,
												className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold shadow-xs",
												children: a.mood
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 space-y-1 px-1 flex-1 flex flex-col justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
													className: "font-display text-lg text-coffee font-bold",
													children: [
														a.name,
														" ",
														a.emoji
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-bold flex items-center gap-1 " + (a.status === "safe" ? "text-sage" : a.status === "needs-care" ? "text-yellow-700" : "text-destructive"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs",
														children: "●"
													}), a.status === "safe" ? "Safe 💚" : a.status === "needs-care" ? "Needs Care 🏥" : "Emergency 🚨"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-hand text-base text-peach mt-0.5",
												children: [
													"\"",
													a.nickname,
													"\""
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border-t border-coffee/5 pt-2 text-[10px] space-y-0.5 text-coffee/70",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"📍 ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: "Home:"
														}),
														" ",
														a.home
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"👀 ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: "Last Seen:"
														}),
														" ",
														a.lastSeenLocation
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"⏰ ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: "Updated:"
														}),
														" ",
														a.lastUpdated
													] })
												]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-3xl border border-coffee/10 bg-white p-4 pb-5 flex flex-col justify-between scrapbook-shadow bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3.5 left-1/2 z-20 h-6 w-16 -translate-x-1/2 bg-peach/40 border border-dashed border-peach/20 opacity-75 shadow-xs" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3.5 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-center border-b border-coffee/5 pb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
														className: "font-display text-base font-bold text-coffee",
														children: [a.name, "'s Love"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-coffee/50",
														children: "Community Care Card"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-3 gap-1 bg-[#FDFBF7] p-2.5 rounded-2xl border border-coffee/5 text-center",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] font-bold text-coffee",
															children: a.communityLove?.followers || 0
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[8px] text-coffee/50 uppercase font-bold tracking-wider",
															children: "Love"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] font-bold text-coffee",
															children: a.communityLove?.memories || 0
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[8px] text-coffee/50 uppercase font-bold tracking-wider",
															children: "Memories"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] font-bold text-coffee",
															children: a.communityLove?.helpers || 0
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[8px] text-coffee/50 uppercase font-bold tracking-wider",
															children: "Helpers"
														})] })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] space-y-1 text-left",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/70",
															children: "🧬 Breed:"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-coffee/85 font-medium",
															children: a.breedType
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-coffee/70",
															children: "🍪 Fav Snack:"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-coffee/85 font-medium",
															children: a.favoriteFood.slice(0, 35)
														})
													] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex flex-wrap gap-1 mt-1",
													children: a.badges.slice(0, 3).map((badge, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "bg-peach/10 border border-peach/25 text-[8px] font-bold text-coffee px-2 py-0.5 rounded-full",
														children: badge
													}, idx))
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/paw-friends/$slug",
											params: { slug: a.slug },
											onClick: (e) => e.stopPropagation(),
											className: "squish block w-full rounded-2xl bg-coffee text-cream text-center py-2.5 text-xs font-bold scrapbook-shadow transition hover:opacity-90 mt-2",
											children: "Open Passport & Stories 📖 →"
										})
									]
								})]
							})
						}, a.slug);
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "stories",
			className: "mx-auto max-w-4xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50 text-center",
					children: "📖 Paw Feed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl sm:text-5xl text-center",
					children: "Today in the village"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg text-coffee/70 text-center max-w-xl mx-auto",
					children: "Little updates written from a paw's point of view — belly rubs, butterflies, rainy afternoons and everything in between."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
          @keyframes pageFlipNext {
            0% { transform: rotateY(0deg); opacity: 1; }
            50% { transform: rotateY(-90deg); opacity: 0.5; }
            100% { transform: rotateY(-180deg); opacity: 0; }
          }
          @keyframes pageFlipPrev {
            0% { transform: rotateY(0deg); opacity: 1; }
            50% { transform: rotateY(90deg); opacity: 0.5; }
            100% { transform: rotateY(180deg); opacity: 0; }
          }
          .animate-page-flip-next {
            animation: pageFlipNext 0.4s ease-in-out forwards;
            transform-origin: left center;
          }
          .animate-page-flip-prev {
            animation: pageFlipPrev 0.4s ease-in-out forwards;
            transform-origin: right center;
          }
        ` }),
				(() => {
					const m = memories[currentBookPage];
					if (!m) return null;
					const a = animals.find((an) => an.slug === m.animalSlug);
					const currentPrints = m.pawPrints + (likes[m.id] || 0);
					const handlePrev = () => {
						if (isBookFlipping || currentBookPage <= 0) return;
						setFlipDirection("prev");
						setIsBookFlipping(true);
						playRustle();
						setTimeout(() => {
							setCurrentBookPage((prev) => prev - 1);
							setIsBookFlipping(false);
						}, 400);
					};
					const handleNext = () => {
						if (isBookFlipping || currentBookPage >= memories.length - 1) return;
						setFlipDirection("next");
						setIsBookFlipping(true);
						playRustle();
						setTimeout(() => {
							setCurrentBookPage((prev) => prev + 1);
							setIsBookFlipping(false);
						}, 400);
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-12 bg-[#7f5539] p-3 sm:p-5 rounded-3xl scrapbook-shadow max-w-4xl mx-auto flex items-stretch",
						children: [
							currentBookPage > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handlePrev,
								className: "absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 bg-peach border-2 border-coffee py-3 px-2 sm:px-3 text-xs font-bold text-coffee rounded-l-xl scrapbook-shadow cursor-pointer transition hover:-translate-x-1 flex flex-col items-center gap-1 leading-none z-30",
								"aria-label": "Previous Page",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◀" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "writing-mode-vertical text-[10px] tracking-wider uppercase font-bold sm:block hidden",
									children: "Prev"
								})]
							}),
							currentBookPage < memories.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleNext,
								className: "absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 bg-peach border-2 border-coffee py-3 px-2 sm:px-3 text-xs font-bold text-coffee rounded-r-xl scrapbook-shadow cursor-pointer transition hover:translate-x-1 flex flex-col items-center gap-1 leading-none z-30",
								"aria-label": "Next Page",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▶" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "writing-mode-vertical text-[10px] tracking-wider uppercase font-bold sm:block hidden",
									children: "Next"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full bg-[#f4ebd0] border-2 border-coffee/20 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 min-h-[480px] shadow-inner overflow-hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-0 h-full w-0.5 border-l border-dashed border-coffee/20 hidden md:block" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex-1 flex flex-col justify-center items-center ${isBookFlipping ? flipDirection === "next" ? "animate-page-flip-next" : "animate-page-flip-prev" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative border border-coffee/10 bg-white p-3 pb-8 scrapbook-shadow rotate-1 w-full max-w-[280px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-coffee/40" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-coffee/40" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "overflow-hidden rounded bg-cream aspect-4/3 w-full relative",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: m.image,
														alt: m.title,
														loading: "eager",
														className: "w-full h-full object-cover"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-4 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "font-hand text-lg text-peach leading-none",
														children: [
															"\"",
															m.title,
															"\""
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-coffee/50 mt-1 uppercase font-bold tracking-widest",
														children: [
															"Page ",
															currentBookPage + 1,
															" of ",
															memories.length
														]
													})]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex-1 flex flex-col justify-between ${isBookFlipping ? flipDirection === "next" ? "animate-page-flip-next" : "animate-page-flip-prev" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
											className: "mb-3 flex items-center justify-between gap-3 pb-2 border-b border-coffee/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex min-w-0 items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: a.image,
													alt: "",
													className: "size-8 shrink-0 rounded-full border border-white object-cover"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "truncate font-bold text-sm",
														children: [
															a.name,
															" ",
															a.emoji
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[9px] text-coffee/50",
														children: [
															m.date,
															" · ",
															m.location
														]
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-cream px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-coffee/60",
												children: moodLabel(m.mood)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-4 bg-[radial-gradient(circle_at_0px_0px,transparent_8px,transparent_8px),linear-gradient(#00000008_1px,transparent_1px)] bg-size-[100%_24px] pl-1 py-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-hand text-xl leading-relaxed text-coffee/85",
												children: [
													"\"",
													m.story,
													"\""
												]
											})
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between border-t border-coffee/5 pt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap gap-2.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
															icon: "❤️",
															label: "Boop",
															onClick: (e) => handleAction(m.id, "Boop", a.name, e)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
															icon: "🍪",
															label: "Treat",
															onClick: (e) => handleAction(m.id, "Treat", a.name, e)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
															icon: "🐾",
															label: "Hug",
															onClick: (e) => handleAction(m.id, "Hug", a.name, e)
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[9px] font-bold uppercase tracking-widest text-coffee/50",
													children: [currentPrints, " Paw Prints"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5 rounded-xl bg-cream/40 p-2.5 border border-coffee/5 max-h-[110px] overflow-y-auto pr-1 scrollbar-thin",
													children: [sampleComments(m.animalSlug).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-bold",
																children: [c.author, ":"]
															}),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-coffee/80",
																children: c.text
															})
														]
													}, c.author)), (m.comments || []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs animate-fade-in",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-bold",
																children: [c.author, ":"]
															}),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-coffee/80",
																children: c.text
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[8px] text-coffee/40 block leading-tight",
																children: c.date
															})
														]
													}, c.id))]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
													onSubmit: (e) => {
														e.preventDefault();
														handleAddComment(m.id);
													},
													className: "flex gap-1.5 items-center",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															placeholder: "Name",
															value: newCommentAuthor,
															onChange: (e) => setNewCommentAuthor(e.target.value),
															className: "w-1/3 rounded-xl border border-coffee/10 bg-white/70 px-2 py-1 text-xs focus:outline-none focus:border-peach"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															placeholder: "Write a kind word...",
															value: newCommentText,
															onChange: (e) => setNewCommentText(e.target.value),
															className: "flex-1 rounded-xl border border-coffee/10 bg-white/70 px-2 py-1 text-xs focus:outline-none focus:border-peach"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "submit",
															className: "squish rounded-xl bg-coffee px-3 py-1 text-xs font-bold text-cream cursor-pointer",
															children: "Send"
														})
													]
												})]
											})]
										})]
									})
								]
							})
						]
					});
				})()
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "garden",
			className: "mx-auto max-w-5xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50",
							children: "❤️ Kindness Wall"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-4xl sm:text-5xl md:text-6xl",
							children: [
								"Every act of ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-peach",
									children: "kindness"
								}),
								" matters"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-xl text-lg text-coffee/70",
							children: "A space where we record feedings, medical support, and small helps. Post your act to earn points and inspire others!"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: "❤️",
							label: "Love Received",
							value: totalLove,
							tone: "peach"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: "🍲",
							label: "Feedings Logged",
							value: kindnessPosts.filter((p) => p.badge.includes("🍲")).length + totalTreats,
							tone: "yellow"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: "✨",
							label: "Kindness Points",
							value: kindnessPoints,
							tone: "sage"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-10 overflow-hidden rounded-3xl border-2 border-dashed border-sage/50 bg-sage/20 p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-4 right-6 text-4xl animate-float",
							children: "🦋"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-4 left-6 text-3xl animate-float",
							style: { animationDelay: "1s" },
							children: "🐾"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-coffee/60",
							children: "Your Kindness Garden today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-4xl sm:text-5xl",
							children: growth.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-md text-coffee/70",
							children: growth.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
            @keyframes beeDrift {
              0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translate(var(--drift-x, 20px), -65px) scale(1.2); opacity: 0; }
            }
            .animate-bee {
              animation: beeDrift 2.2s ease-out forwards;
            }
          ` }),
						beeParticles.map((b) => {
							const driftX = Math.random() * 40 - 20;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "fixed pointer-events-none text-base z-50 animate-bee",
								style: {
									left: `${b.x}px`,
									top: `${b.y}px`,
									animationDelay: `${b.delay}ms`,
									"--drift-x": `${driftX}px`
								},
								children: "🐝"
							}, b.id);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-8 grid max-w-2xl grid-cols-6 gap-3 sm:grid-cols-10",
							children: Array.from({ length: 30 }).map((_, i) => {
								const flowers = [
									"🌸",
									"🌻",
									"🌼",
									"🌺",
									"🌷"
								];
								const currentEmoji = flowerStates[i] || flowers[i % flowers.length];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => handleFlowerClick(i, e),
									className: "flex aspect-square items-center justify-center rounded-xl bg-white text-2xl transition-all hover:scale-115 active:scale-90 cursor-pointer " + (i < totalMemories * 6 || i < kindnessPosts.length * 3 ? "opacity-100 animate-sway" : "opacity-20"),
									style: { animationDelay: `${i % 5 * .3}s` },
									children: currentEmoji
								}, i);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 grid gap-8 md:grid-cols-5 items-start text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-lg font-bold text-coffee flex items-center gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✍️ Log Care Act" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-coffee/60 mb-4",
								children: "Did you feed or help an animal today? Share it to grow our wall!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmitKindness,
								className: "space-y-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] font-bold uppercase tracking-wider text-coffee/60",
										children: "Your Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										type: "text",
										maxLength: 50,
										placeholder: "e.g. Sejal",
										value: newKindnessAuthor,
										onChange: (e) => setNewKindnessAuthor(e.target.value),
										className: "mt-1 w-full rounded-xl border border-coffee/10 bg-cream/20 px-3 py-1.5 text-xs focus:outline-none focus:border-peach font-normal"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] font-bold uppercase tracking-wider text-coffee/60",
										children: "What did you do?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										rows: 3,
										maxLength: 250,
										placeholder: "e.g. Shared biscuits with Bruno near College Gate today.",
										value: newKindnessText,
										onChange: (e) => setNewKindnessText(e.target.value),
										className: "mt-1 w-full rounded-xl border border-coffee/10 bg-cream/20 px-3 py-1.5 text-xs focus:outline-none focus:border-peach resize-none font-normal"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] font-bold uppercase tracking-wider text-coffee/60",
										children: "Assistance Badge"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: newKindnessBadge,
										onChange: (e) => setNewKindnessBadge(e.target.value),
										className: "mt-1 w-full rounded-xl border border-coffee/10 bg-cream/20 px-3 py-1.5 text-xs focus:outline-none focus:border-peach font-normal",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Food Friend 🍲" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Care Hero 🏥" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Memory Keeper 📖" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Paw Guardian 🐾" })
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "squish w-full py-2.5 rounded-full bg-coffee hover:bg-coffee/90 text-cream text-xs font-bold font-display shadow-xs flex items-center justify-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log Act" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] bg-peach/20 text-peach px-2 py-0.5 rounded-full font-mono font-bold",
											children: "+10 Pts 🎉"
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-3 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-display text-lg font-bold text-coffee flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "❤️ Kindness Log Feed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] bg-sage/20 text-coffee/70 px-2.5 py-0.5 rounded-full font-mono",
								children: [kindnessPosts.length, " Logs"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3.5 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin",
							children: kindnessPosts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/50 text-center py-10 bg-cream/10 rounded-2xl border border-dashed border-coffee/10",
								children: "No logs posted yet. Be the first!"
							}) : kindnessPosts.map((p) => {
								const colors = [
									"bg-[#FFFDF6] border-peach/20",
									"bg-[#F7FCF6] border-sage/20",
									"bg-[#F5FAFC] border-sky/20"
								];
								const selectedBg = colors[p.id.length % colors.length];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-4 rounded-2xl border scrapbook-shadow transition-transform hover:-translate-y-0.5 duration-200 relative ${selectedBg}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-3.5 right-3.5 text-[10px] bg-coffee/5 text-coffee/65 px-2 py-0.5 rounded-full font-bold font-display",
											children: p.badge
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm text-coffee",
												children: p.author
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500 text-xs",
												children: "❤️"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-coffee/85 mt-1.5 leading-relaxed font-hand text-base",
											children: [
												"\"",
												p.text,
												"\""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center mt-3 pt-2 border-t border-coffee/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] text-coffee/40 font-mono",
												children: p.date
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm",
												children: [
													"+",
													p.points,
													" Pts"
												]
											})]
										})
									]
								}, p.id);
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "The gardeners",
						title: "Friends who grew this meadow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: animals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/paw-friends/$slug",
							params: { slug: a.slug },
							className: "flex items-center gap-3 rounded-2xl border border-coffee/10 bg-white p-3 scrapbook-shadow transition-transform hover:-translate-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: a.image,
								alt: "",
								className: "size-14 rounded-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate font-bold text-left",
									children: [
										a.name,
										" ",
										a.emoji
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-coffee/60 text-left",
									children: [
										a.stats.memories,
										" memories · ",
										a.stats.pawPrints,
										" love"
									]
								})]
							})]
						}, a.slug))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "found-friends",
			className: "mx-auto max-w-6xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Community",
					title: "I Found A Friend 🐾",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							document.getElementById("share-friend-form")?.scrollIntoView({ behavior: "smooth" });
						},
						className: "rounded-full bg-peach px-5 py-2 text-sm font-bold text-coffee hover:scale-105 cursor-pointer",
						children: "Share yours"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-sm text-coffee/70",
					children: "These are little souls people met on the street and wanted to remember. Every story is reviewed by our tiny team before it appears here."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-[#e6ccb2]/20 border-4 border-dashed border-[#7f5539] rounded-3xl p-6 relative",
					children: [allSubmissions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full rounded-2xl border border-dashed border-coffee/20 bg-white/50 p-8 text-center text-sm text-coffee/60",
						children: "No community friends yet. Be the first to share one 🌸"
					}), allSubmissions.map((r, i) => {
						const isLocal = "isLocal" in r && r.isLocal;
						const colors = [
							"bg-[#fefae0]",
							"bg-[#e8f5e9]",
							"bg-[#e1f5fe]",
							"bg-[#fce4ec]"
						];
						const rotations = [
							"rotate-1",
							"-rotate-2",
							"rotate-2",
							"-rotate-1",
							"rotate-3",
							"-rotate-3"
						];
						const noteColor = colors[i % colors.length];
						const rotation = rotations[i % rotations.length];
						const { needType, needStatus, cleanStory } = parseHelpBoardItem(r);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `relative p-5 scrapbook-shadow border border-coffee/10 transition-all hover:scale-103 hover:rotate-0 duration-300 ${noteColor} ${rotation} rounded-2xl flex flex-col justify-between`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 select-none drop-shadow",
									children: "📌"
								}),
								isLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-2.5 right-2.5 z-10 rounded-full bg-sage px-2 py-0.5 text-[8px] font-bold text-coffee shadow-xs",
									children: "🏡 Local"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border border-coffee/5 bg-white p-2 pb-5 shadow-sm rounded-sm mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
										storageRef: r.photo_url,
										alt: r.name,
										className: "h-40 w-full object-cover rounded-sm"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-lg font-bold text-coffee",
												children: r.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-coffee/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-coffee/70",
												children: r.species
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-1.5 items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-peach/10 border border-peach/25 px-2 py-0.5 text-[9px] font-bold text-coffee/80",
												children: needType
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded-full px-2 py-0.5 text-[9px] font-bold ${needStatus === "open" ? "bg-red-100 text-red-800" : needStatus === "helping" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`,
												children: needStatus === "open" ? "🚨 Open / Needs Help" : needStatus === "helping" ? "🟡 Someone Helping" : "💚 Help Completed"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-coffee/60 font-semibold mt-1",
											children: ["📍 ", r.location]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-coffee/80 leading-relaxed font-hand text-base",
											children: [
												"\"",
												cleanStory,
												"\""
											]
										}),
										r.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 border border-coffee/5 bg-white p-1 rounded",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedVideo, {
												storageRef: r.video_url,
												className: "w-full rounded-sm"
											})
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 border-t border-coffee/5 pt-3 flex flex-col gap-2",
									children: [
										needStatus !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleHelpItem(r),
											className: `squish w-full py-2 rounded-xl text-xs font-bold text-coffee border border-coffee/10 scrapbook-shadow cursor-pointer transition-colors ${needStatus === "helping" ? "bg-[#e6f4ea] hover:bg-green-200" : "bg-[#fcf3ef] hover:bg-peach"}`,
											children: needStatus === "helping" ? "💚 Mark as Help Completed" : "🍲 I Can Help!"
										}),
										needStatus === "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleHelpItem(r),
											className: "squish w-full py-2 rounded-xl text-xs font-bold text-coffee/40 bg-cream/40 border border-coffee/5 cursor-pointer hover:bg-cream",
											children: "🔄 Reopen Assistance Alert"
										}),
										isLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[8px] font-bold text-coffee/40 text-center italic",
											children: "*Saved to local device cache."
										})
									]
								})
							]
						}, r.id);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: "share-friend-form",
					className: "mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionSection, {})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "explore",
			className: "mx-auto max-w-6xl px-6 pt-20 pb-4 scroll-mt-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50",
					children: "🌈 Explore the World"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl sm:text-5xl",
					children: "Wander a little"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-lg text-coffee/70",
					children: "Two cozy corners to lose yourself in — a village map, and a story-weaver that speaks in a paw's voice."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-8 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setExploreTab("map"),
						className: "rounded-full border px-4 py-2 text-sm font-bold transition-colors cursor-pointer " + (exploreTab === "map" ? "border-coffee bg-coffee text-cream" : "border-coffee/15 bg-white text-coffee hover:bg-cream/60"),
						children: "🗺️ Paw World Map"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setExploreTab("weaver"),
						className: "rounded-full border px-4 py-2 text-sm font-bold transition-colors cursor-pointer " + (exploreTab === "weaver" ? "border-coffee bg-coffee text-cream" : "border-coffee/15 bg-white text-coffee hover:bg-cream/60"),
						children: "✨ Story Weaver"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: exploreTab === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-sage/30 p-6 shadow-2xl sm:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute top-6 left-8 text-4xl animate-drift opacity-70",
								children: "☁️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute top-16 right-20 text-5xl animate-drift opacity-60",
								style: { animationDelay: "-8s" },
								children: "☁️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute bottom-6 left-1/4 text-3xl",
								children: "🌳"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute bottom-10 right-16 text-3xl",
								children: "🌸"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute top-1/2 left-8 text-2xl opacity-70",
								children: "🌿"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2.5 justify-center mb-6",
								children: [
									{
										id: "all",
										label: "All Friends 🐾"
									},
									{
										id: "safe",
										label: "Safe 💚"
									},
									{
										id: "needs-food",
										label: "Needs Food 🍲"
									},
									{
										id: "needs-care",
										label: "Needs Care 🏥"
									},
									{
										id: "new-friend",
										label: "New Friend ✨"
									}
								].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMapFilter(f.id),
									className: `squish px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${mapFilter === f.id ? "bg-coffee border-coffee text-cream" : "bg-white border-coffee/10 text-coffee hover:bg-cream"}`,
									children: f.label
								}, f.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mx-auto aspect-16/10 w-full rounded-4xl bg-linear-to-b from-sky/40 via-cream/60 to-sage/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "absolute inset-0 h-full w-full",
									viewBox: "0 0 400 250",
									preserveAspectRatio: "none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 0 200 Q 200 100 400 200",
										stroke: "rgba(123,75,50,0.15)",
										strokeWidth: "4",
										strokeDasharray: "8 6",
										fill: "none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 200 0 Q 240 120 200 250",
										stroke: "rgba(123,75,50,0.15)",
										strokeWidth: "4",
										strokeDasharray: "8 6",
										fill: "none"
									})]
								}), mapPlaces.map((p) => {
									const a = getAnimal(p.animals[0]);
									if (!a) return null;
									if (mapFilter !== "all" && a.status !== mapFilter) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setFoundPlaceAnimal(a.slug),
										className: "group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
										style: {
											top: p.top,
											left: p.left
										},
										"aria-label": `Visit ${p.name}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 rounded-xl bg-white px-2 py-1 text-center text-[10px] font-bold shadow scrapbook-shadow",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												p.icon,
												" ",
												p.name
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto size-14 overflow-hidden rounded-full border-4 border-white bg-white animate-float shadow-lg transition-transform group-hover:scale-110",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: a.image,
												alt: a.name,
												className: "h-full w-full object-cover"
											})
										})]
									}, p.id);
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-center text-sm font-bold uppercase tracking-widest text-coffee/60",
								children: "Tap a place · Meet a friend"
							}),
							mapAnimal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex justify-center animate-fade-in",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative border border-coffee/10 bg-white p-4 pb-6 scrapbook-shadow rotate-[1.5deg] w-full max-w-sm flex gap-4 items-center rounded-2xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 left-1/2 z-20 h-5 w-14 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-24 aspect-square overflow-hidden rounded-xl border border-coffee/5 shrink-0 bg-cream",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: mapAnimal.image,
												alt: mapAnimal.name,
												className: "size-full object-cover"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 text-left space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
														className: "font-display text-lg font-bold text-coffee",
														children: [
															mapAnimal.name,
															" ",
															mapAnimal.emoji
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[8px] font-bold px-2 py-0.5 rounded-full ${mapAnimal.status === "safe" ? "bg-green-100 text-green-800" : mapAnimal.status === "needs-food" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
														children: mapAnimal.status === "safe" ? "Safe 💚" : mapAnimal.status === "needs-food" ? "Needs Food 🍲" : mapAnimal.status === "needs-care" ? "Needs Care 🏥" : "New Friend 🐾"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-hand text-base text-peach",
													children: [
														"\"",
														mapAnimal.nickname,
														"\""
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-coffee/70",
													children: ["📍 ", mapAnimal.home]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/paw-friends/$slug",
													params: { slug: mapAnimal.slug },
													className: "inline-block text-[10px] font-bold text-coffee underline hover:text-peach pt-1",
													children: "Open Passport & Stories 📖 →"
												})
											]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
								children: animals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/paw-friends/$slug",
									params: { slug: a.slug },
									className: "flex items-center gap-3 rounded-2xl border border-coffee/10 bg-white p-3 scrapbook-shadow hover:-translate-y-1 transition-transform",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: a.image,
										alt: "",
										className: "size-12 rounded-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-bold",
											children: [
												a.name,
												" ",
												a.emoji
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-coffee/60",
											children: ["📍 ", a.home]
										})]
									})]
								}, a.slug))
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border-2 border-dashed border-peach/50 bg-white/80 p-6 scrapbook-shadow sm:p-10",
						children: [
							isReunion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 rounded-2xl border-2 border-yellow bg-yellow/5 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl block mb-1",
										children: "🌟"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg font-bold text-coffee",
										children: "Village Picnic Reunion Unlocked!"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-coffee/85 max-w-md mx-auto mt-1",
										children: "You collected all 4 Village Passport stamps! As a reward, you can weave their reunion picnic adventure."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-widest text-coffee/60",
								children: "✨ Story Weaver"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-3xl",
								children: isReunion ? "Gather the village friends for a warm adventure." : "Give me a friend, and I'll write in their voice."
							}),
							!isReunion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold uppercase tracking-widest text-coffee/60",
											children: "Friend"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: weaverSlug,
											onChange: (e) => setWeaverSlug(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold",
											children: animals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: a.slug,
												children: [
													a.name,
													" ",
													a.emoji,
													" — ",
													a.nickname
												]
											}, a.slug))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold uppercase tracking-widest text-coffee/60",
											children: "Story kind"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: weaverMode,
											onChange: (e) => setWeaverMode(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "pov",
													children: "Animal's POV story"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "story",
													children: "Cute little story"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "caption",
													children: "Instagram caption"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "adoption",
													children: "Adoption story"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold uppercase tracking-widest text-coffee/60",
											children: "Mood"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 flex flex-wrap gap-2",
											children: [
												"happy",
												"funny",
												"emotional",
												"rain",
												"rescue",
												"night"
											].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setWeaverMood(m),
												className: "rounded-full border px-3 py-1 text-sm font-bold cursor-pointer " + (weaverMood === m ? "border-coffee bg-coffee text-cream" : "border-coffee/15 bg-white hover:bg-cream/60"),
												children: m
											}, m))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onWeaveGenerate,
								disabled: weaverLoading,
								className: "mt-6 rounded-2xl bg-coffee px-6 py-3 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer",
								children: weaverLoading ? "Gathering friends..." : isReunion ? "🌟 Weave Reunion Picnic Story" : `✨ Weave a story for ${currentWeaveAnimal?.name || "Friend"}`
							}),
							weaverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive",
								children: weaverError
							}),
							weaverResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 rounded-2xl border border-coffee/10 bg-cream/60 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-xs font-bold uppercase tracking-widest text-coffee/50",
									children: isReunion ? "The Village Gathering 🌸" : `A story from ${currentWeaveAnimal?.name || "Friend"} ${currentWeaveAnimal?.emoji || "🐾"}`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-line font-hand text-2xl leading-snug text-coffee",
									children: weaverResult
								})]
							}),
							showCertificate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 rounded-3xl border-4 border-dashed border-yellow bg-cream/35 p-6 text-center scrapbook-shadow max-w-md mx-auto animate-fade-in relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-5xl block animate-pulse",
										children: "🏅"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl text-coffee mt-2",
										children: "Village Protector Certificate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-coffee/50 font-bold uppercase tracking-wider mt-1",
										children: "Awarded to"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Enter your name",
										value: playerName,
										onChange: (e) => setPlayerName(e.target.value),
										className: "mt-2 mx-auto block w-64 text-center font-hand text-2xl text-peach bg-transparent border-b-2 border-coffee/20 outline-none focus:border-peach pb-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-coffee/75 mt-4 leading-relaxed",
										children: "For exploring the village of College Street, finding all 4 friends (Coco, Moti, Kitty, Tommy), and protecting their memories in their digital Scrapbook."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 border-t border-coffee/15 pt-3 flex items-center justify-between text-[10px] text-coffee/50 uppercase tracking-widest font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐾 PawBook Village" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💮 Collector No. 402" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											shareContent({
												title: "Village Protector Certificate!",
												text: "I matched with all four friends and earned the Village Protector Certificate on PawBook! 🐾",
												url: window.location.origin
											}, () => toast.success("Certificate shared / copied successfully! 🌟"), () => toast.error("Could not share automatically. Please share the URL from your browser address bar."));
										},
										className: "mt-6 w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-105 cursor-pointer",
										children: "📸 Share Certificate"
									})
								]
							})
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed bottom-6 right-6 z-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setQuizOpen(true),
				className: "flex items-center gap-2 rounded-full border border-coffee bg-peach px-4 py-2.5 text-xs font-bold text-coffee scrapbook-shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer",
				children: "🎮 Play Quiz"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetQuizModal, {
			forceOpen: quizOpen,
			onClose: () => setQuizOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes particleUp {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-75px) scale(1.3) rotate(var(--rot-deg, 0deg)); opacity: 0; }
        }
        .animate-particle-up {
          animation: particleUp 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      ` }),
		actionParticles.map((p) => {
			const rot = Math.random() * 60 - 30;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "fixed pointer-events-none text-2xl z-50 animate-particle-up",
				style: {
					left: `${p.x}px`,
					top: `${p.y}px`,
					"--rot-deg": `${rot}deg`
				},
				children: p.emoji
			}, p.id);
		})
	] });
}
function ActionButton({ icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "squish flex items-center gap-1 text-xs font-bold transition-transform hover:scale-110 active:scale-95 hover:text-peach cursor-pointer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg",
				children: icon
			}),
			" ",
			label
		]
	});
}
function PetPhoto({ slug, image, className }) {
	const [accessory, setAccessory] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const handleUpdate = () => {
			setAccessory(localStorage.getItem(`pawbook-accessory-${slug}`));
		};
		handleUpdate();
		window.addEventListener("pawbook-accessory-updated", handleUpdate);
		return () => window.removeEventListener("pawbook-accessory-updated", handleUpdate);
	}, [slug]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative ${className || "h-full w-full"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: "",
				className: "h-full w-full object-cover",
				style: slug === "coco" ? { objectPosition: "center 25%" } : void 0
			}),
			accessory === "crown" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-1.5 left-1/2 -translate-x-1/2 text-4xl select-none drop-shadow z-10 animate-bounce",
				style: { animationDuration: "2s" },
				children: "👑"
			}),
			accessory === "scarf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl select-none drop-shadow z-10",
				children: "🧣"
			}),
			accessory === "glasses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-10 left-1/2 -translate-x-1/2 text-3xl select-none drop-shadow z-10",
				children: "🕶️"
			}),
			accessory === "hat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-3 left-1/3 text-4xl select-none drop-shadow z-10 rotate-12",
				children: "🥳"
			})
		]
	});
}
function moodLabel(m) {
	return {
		happy: "😊 Happy",
		emotional: "🥺 Emotional",
		rain: "🌧 Rainy",
		funny: "😂 Funny",
		rescue: "❤️ Rescue",
		night: "🌙 Night"
	}[m] ?? m;
}
function sampleComments(slug) {
	return {
		moti: [{
			author: "Coco 🐕",
			text: "Save some treats for me 🍖"
		}, {
			author: "Kitty 🐈",
			text: "Cute human friends ❤️"
		}],
		kitty: [{
			author: "Tommy 🐕",
			text: "Butterflies are the best friends"
		}, {
			author: "Moti 🐶",
			text: "I want a rooftop day too"
		}],
		coco: [{
			author: "Moti 🐶",
			text: "Friendly tiger behavior 🐯"
		}, {
			author: "Tommy 🐕",
			text: "Teach me your ways"
		}],
		tommy: [{
			author: "Coco 🐕",
			text: "Rainy days are the coziest"
		}, {
			author: "Kitty 🐈",
			text: "Stay dry little one 🌧"
		}]
	}[slug] ?? [];
}
function StatCard({ icon, label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl sm:rounded-3xl border border-coffee/10 bg-${tone}/40 p-3 sm:p-6 text-center scrapbook-shadow`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-2xl sm:text-4xl",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 sm:mt-2 font-display text-xl sm:text-4xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[9px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-widest text-coffee/60 leading-tight mt-0.5 sm:mt-1",
				children: label
			})
		]
	});
}
function SubmissionSection() {
	const { user, loading } = useSession();
	if (loading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitForm, { user });
}
function SubmitForm({ user }) {
	const submit = useServerFn(submitFoundFriend);
	const router = useRouter();
	const [name, setName] = (0, import_react.useState)("");
	const [needAName, setNeedAName] = (0, import_react.useState)(false);
	const [species, setSpecies] = (0, import_react.useState)("Dog");
	const [needType, setNeedType] = (0, import_react.useState)("Just sharing memory");
	const [location, setLocation] = (0, import_react.useState)("");
	const [story, setStory] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [video, setVideo] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!photo) {
			toast.error("A photo helps us remember them 📸");
			return;
		}
		setBusy(true);
		try {
			let activeUserId = user?.id;
			if (!activeUserId) {
				const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
				if (anonError) throw anonError;
				activeUserId = anonData.user?.id;
			}
			if (!activeUserId) throw new Error("Could not authenticate visitor anonymously.");
			const { path: photoRef } = await uploadToBucket("animal-photos", photo, activeUserId);
			let videoRef = null;
			if (video) videoRef = (await uploadToBucket("pawbook-videos", video, activeUserId)).path;
			const finalName = needAName ? "Need a Name 🐾" : name;
			const finalStory = `${story} [type:${needType}][status:open]`;
			await submit({ data: {
				name: finalName,
				species,
				location,
				story: finalStory,
				photoRef,
				videoRef
			} });
			toast.success("Thank you 🌸 A moderator will review it soon.");
			setName("");
			setNeedAName(false);
			setLocation("");
			setStory("");
			setPhoto(null);
			setVideo(null);
			router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "scrapbook-shadow mx-auto max-w-2xl rounded-3xl border border-coffee/10 bg-white/90 p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl",
				children: "Tell us about your new friend"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-coffee/70",
				children: "A photo, a name, a little story. That's all."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-semibold flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Their name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-xs font-normal text-coffee/60 normal-case cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: needAName,
									onChange: (e) => {
										setNeedAName(e.target.checked);
										if (e.target.checked) setName("");
									}
								}), "Need a Name"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: !needAName,
							disabled: needAName,
							maxLength: 80,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: needAName ? "Will be named by community..." : "e.g. Biscuit",
							className: "mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach disabled:opacity-50"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-semibold",
						children: ["Need Type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: needType,
							onChange: (e) => setNeedType(e.target.value),
							className: "mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Just sharing memory" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Needs food" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Needs medical care" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Lost pet" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Looking for adoption" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-semibold",
						children: ["Species", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: species,
							onChange: (e) => setSpecies(e.target.value),
							className: "mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Dog" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cat" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Bird" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cow" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-semibold",
						children: ["Where you met", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							maxLength: 120,
							value: location,
							onChange: (e) => setLocation(e.target.value),
							placeholder: "e.g. Behind the tea shop",
							className: "mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "sm:col-span-2 text-sm font-semibold",
						children: ["Their little story", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							minLength: 10,
							maxLength: 2e3,
							rows: 4,
							value: story,
							onChange: (e) => setStory(e.target.value),
							placeholder: "What did they do? How did they look at you?",
							className: "mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-semibold",
						children: ["Photo (required)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "file",
							accept: "image/*",
							onChange: (e) => setPhoto(e.target.files?.[0] ?? null),
							className: "mt-1 w-full text-xs font-normal"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-semibold",
						children: ["Video (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "video/*",
							onChange: (e) => setVideo(e.target.files?.[0] ?? null),
							className: "mt-1 w-full text-xs font-normal"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: busy,
				className: "mt-6 w-full rounded-full bg-coffee px-6 py-3 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-50 cursor-pointer",
				children: busy ? "Sending love…" : "Share this friend 🐾"
			})
		]
	});
}
//#endregion
export { PetPhoto, HomePage as component };
