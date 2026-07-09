import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DehiQiIM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as spinRewards, l as surprises, o as memories, r as dialogues, s as quizQuestions, t as animals } from "./pawbook-data-CqSvBvet.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as PageShell } from "./SiteChrome-D0iB99sW.mjs";
import { i as reviewSubmission, o as useServerFn, r as listPendingSubmissions } from "./submissions.functions-BVJQlA9q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pet-studio-pU2bIVsH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PetStudioPage() {
	const getPending = useServerFn(listPendingSubmissions);
	const review = useServerFn(reviewSubmission);
	const [activeTab, setActiveTab] = (0, import_react.useState)("dashboard");
	const [animals$1, setAnimals] = (0, import_react.useState)([]);
	const [memories$1, setMemories] = (0, import_react.useState)([]);
	const [dialogues$1, setDialogues] = (0, import_react.useState)([]);
	const [quizQuestions$1, setQuizQuestions] = (0, import_react.useState)([]);
	const [spinRewards$1, setSpinRewards] = (0, import_react.useState)([]);
	const [surprises$1, setSurprises] = (0, import_react.useState)([]);
	const [localSubmissions, setLocalSubmissions] = (0, import_react.useState)([]);
	const [loveStats, setLoveStats] = (0, import_react.useState)({});
	const [treatStats, setTreatStats] = (0, import_react.useState)({});
	const loadCMSData = (0, import_react.useCallback)(async () => {
		const savedAnimals = localStorage.getItem("pawbook-cms-animals");
		const savedMemories = localStorage.getItem("pawbook-cms-memories");
		const savedDialogues = localStorage.getItem("pawbook-cms-dialogues");
		const savedQuiz = localStorage.getItem("pawbook-cms-quiz");
		const savedSpin = localStorage.getItem("pawbook-cms-spinwheel");
		const savedSurprises = localStorage.getItem("pawbook-cms-surprises");
		setAnimals(savedAnimals ? JSON.parse(savedAnimals) : animals);
		setMemories(savedMemories ? JSON.parse(savedMemories) : memories);
		setDialogues(savedDialogues ? JSON.parse(savedDialogues) : dialogues);
		setQuizQuestions(savedQuiz ? JSON.parse(savedQuiz) : quizQuestions);
		setSpinRewards(savedSpin ? JSON.parse(savedSpin) : spinRewards);
		setSurprises(savedSurprises ? JSON.parse(savedSurprises) : surprises);
		try {
			const subs = await getPending();
			setLocalSubmissions(subs || []);
		} catch (e) {
			console.error("Failed to load live Supabase submissions", e);
			const savedSubs = localStorage.getItem("pawbook-local-submissions");
			setLocalSubmissions(savedSubs ? JSON.parse(savedSubs) : []);
		}
		const love = {};
		const treats = {};
		animals.forEach((a) => {
			love[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-love-${a.slug}`) || "0", 10);
			treats[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-treats-${a.slug}`) || "0", 10);
		});
		setLoveStats(love);
		setTreatStats(treats);
	}, [getPending]);
	(0, import_react.useEffect)(() => {
		loadCMSData();
	}, [loadCMSData]);
	const saveCMSData = async (updatedAnimals, updatedMemories, updatedDialogues, updatedQuiz, updatedSpin, updatedSurprises) => {
		localStorage.setItem("pawbook-cms-animals", JSON.stringify(updatedAnimals));
		localStorage.setItem("pawbook-cms-memories", JSON.stringify(updatedMemories));
		localStorage.setItem("pawbook-cms-dialogues", JSON.stringify(updatedDialogues));
		localStorage.setItem("pawbook-cms-quiz", JSON.stringify(updatedQuiz));
		localStorage.setItem("pawbook-cms-spinwheel", JSON.stringify(updatedSpin));
		localStorage.setItem("pawbook-cms-surprises", JSON.stringify(updatedSurprises));
		setAnimals(updatedAnimals);
		setMemories(updatedMemories);
		setDialogues(updatedDialogues);
		setQuizQuestions(updatedQuiz);
		setSpinRewards(updatedSpin);
		setSurprises(updatedSurprises);
		try {
			const { error } = await supabase.from("cms_data").update({
				animals: updatedAnimals,
				memories: updatedMemories,
				dialogues: updatedDialogues,
				quiz_questions: updatedQuiz,
				spin_rewards: updatedSpin,
				surprises: updatedSurprises,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", "main");
			if (error) throw error;
			toast.success("CMS configurations saved to Supabase backend! ☁️🐾");
		} catch (e) {
			console.error("Failed to save to Supabase database:", e);
			toast.error("Database save failed. Cached locally in browser.");
		}
		window.dispatchEvent(new Event("pawbook-cms-updated"));
	};
	const handleReset = async () => {
		if (!confirm("Are you sure you want to reset all CMS content to default settings?")) return;
		try {
			const { error } = await supabase.from("cms_data").update({
				animals,
				memories,
				dialogues,
				quiz_questions: quizQuestions,
				spin_rewards: spinRewards,
				surprises,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", "main");
			if (error) throw error;
			toast.success("Database settings reset to defaults! 🌸");
		} catch (e) {
			console.error(e);
			toast.error("Failed to reset database settings. Resetting local cache only.");
		}
		localStorage.removeItem("pawbook-cms-animals");
		localStorage.removeItem("pawbook-cms-memories");
		localStorage.removeItem("pawbook-cms-dialogues");
		localStorage.removeItem("pawbook-cms-quiz");
		localStorage.removeItem("pawbook-cms-spinwheel");
		localStorage.removeItem("pawbook-cms-surprises");
		loadCMSData();
	};
	const handleFileChange = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (err) => reject(err);
			reader.readAsDataURL(file);
		});
	};
	const [selectedPetIdx, setSelectedPetIdx] = (0, import_react.useState)(0);
	const [petFormName, setPetFormName] = (0, import_react.useState)("");
	const [petFormEmoji, setPetFormEmoji] = (0, import_react.useState)("");
	const [petFormNickname, setPetFormNickname] = (0, import_react.useState)("");
	const [petFormBio, setPetFormBio] = (0, import_react.useState)("");
	const [petFormStory, setPetFormStory] = (0, import_react.useState)("");
	const [petFormFavFood, setPetFormFavFood] = (0, import_react.useState)("");
	const [petFormMood, setPetFormMood] = (0, import_react.useState)("");
	const [petFormPic, setPetFormPic] = (0, import_react.useState)("");
	const [petFormLastSeen, setPetFormLastSeen] = (0, import_react.useState)("");
	const [petFormVaccinated, setPetFormVaccinated] = (0, import_react.useState)(false);
	const [petFormSterilized, setPetFormSterilized] = (0, import_react.useState)(false);
	const [petFormMedicalNotes, setPetFormMedicalNotes] = (0, import_react.useState)("");
	const [petFormAgeEst, setPetFormAgeEst] = (0, import_react.useState)("");
	const [petFormGender, setPetFormGender] = (0, import_react.useState)("");
	const [petFormBreedType, setPetFormBreedType] = (0, import_react.useState)("");
	const [petFormKnownSince, setPetFormKnownSince] = (0, import_react.useState)("");
	const [petFormHomeArea, setPetFormHomeArea] = (0, import_react.useState)("");
	const [petFormFriendliness, setPetFormFriendliness] = (0, import_react.useState)(80);
	const [petFormEnergy, setPetFormEnergy] = (0, import_react.useState)(70);
	const [petFormTrust, setPetFormTrust] = (0, import_react.useState)(85);
	const [petFormPlayfulness, setPetFormPlayfulness] = (0, import_react.useState)(75);
	const [petFormHealthRecords, setPetFormHealthRecords] = (0, import_react.useState)([]);
	const [petFormCareTimeline, setPetFormCareTimeline] = (0, import_react.useState)([]);
	const [newHealthDate, setNewHealthDate] = (0, import_react.useState)("");
	const [newHealthType, setNewHealthType] = (0, import_react.useState)("Vaccination");
	const [newHealthNote, setNewHealthNote] = (0, import_react.useState)("");
	const [newCareDate, setNewCareDate] = (0, import_react.useState)("");
	const [newCareLabel, setNewCareLabel] = (0, import_react.useState)("");
	const [newCareNote, setNewCareNote] = (0, import_react.useState)("");
	const handleAddHealth = () => {
		if (!newHealthDate || !newHealthNote) return;
		const entry = {
			date: newHealthDate,
			type: newHealthType,
			note: newHealthNote
		};
		setPetFormHealthRecords([...petFormHealthRecords, entry]);
		setNewHealthDate("");
		setNewHealthNote("");
	};
	const handleRemoveHealth = (idx) => {
		setPetFormHealthRecords(petFormHealthRecords.filter((_, i) => i !== idx));
	};
	const handleAddCare = () => {
		if (!newCareDate || !newCareLabel || !newCareNote) return;
		const entry = {
			date: newCareDate,
			label: newCareLabel,
			note: newCareNote
		};
		setPetFormCareTimeline([...petFormCareTimeline, entry]);
		setNewCareDate("");
		setNewCareLabel("");
		setNewCareNote("");
	};
	const handleRemoveCare = (idx) => {
		setPetFormCareTimeline(petFormCareTimeline.filter((_, i) => i !== idx));
	};
	(0, import_react.useEffect)(() => {
		if (animals$1[selectedPetIdx]) {
			const p = animals$1[selectedPetIdx];
			setPetFormName(p.name);
			setPetFormEmoji(p.emoji);
			setPetFormNickname(p.nickname);
			setPetFormBio(p.bio);
			setPetFormStory(p.story);
			setPetFormFavFood(p.favoriteFood);
			setPetFormMood(p.mood);
			setPetFormPic(p.image);
			setPetFormLastSeen(p.lastSeenLocation || "");
			setPetFormVaccinated(!!p.vaccinated);
			setPetFormSterilized(!!p.sterilized);
			setPetFormMedicalNotes(p.medicalNotes || "");
			setPetFormAgeEst(p.ageEstimate || "");
			setPetFormGender(p.gender || "");
			setPetFormBreedType(p.breedType || "");
			setPetFormKnownSince(p.knownSince || "");
			setPetFormHomeArea(p.homeArea || "");
			setPetFormFriendliness(p.friendliness || 80);
			setPetFormEnergy(p.energy || 70);
			setPetFormTrust(p.trust || 85);
			setPetFormPlayfulness(p.playfulness || 75);
			setPetFormHealthRecords(p.healthRecords || []);
			setPetFormCareTimeline(p.careTimeline || []);
		}
	}, [selectedPetIdx, animals$1]);
	const handleUpdatePetProfile = () => {
		const updated = [...animals$1];
		updated[selectedPetIdx] = {
			...updated[selectedPetIdx],
			name: petFormName,
			emoji: petFormEmoji,
			nickname: petFormNickname,
			bio: petFormBio,
			story: petFormStory,
			favoriteFood: petFormFavFood,
			mood: petFormMood,
			image: petFormPic,
			lastSeenLocation: petFormLastSeen,
			lastUpdated: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric"
			}) + " (Admin)",
			vaccinated: petFormVaccinated,
			sterilized: petFormSterilized,
			medicalNotes: petFormMedicalNotes,
			ageEstimate: petFormAgeEst,
			gender: petFormGender,
			breedType: petFormBreedType,
			knownSince: petFormKnownSince,
			homeArea: petFormHomeArea,
			friendliness: Number(petFormFriendliness),
			energy: Number(petFormEnergy),
			trust: Number(petFormTrust),
			playfulness: Number(petFormPlayfulness),
			healthRecords: petFormHealthRecords,
			careTimeline: petFormCareTimeline
		};
		saveCMSData(updated, memories$1, dialogues$1, quizQuestions$1, spinRewards$1, surprises$1);
		toast.success(`${petFormName}'s profile details updated! 🐾`);
	};
	const [memFormPet, setMemFormPet] = (0, import_react.useState)("coco");
	const [memFormTitle, setMemFormTitle] = (0, import_react.useState)("");
	const [memFormStory, setMemFormStory] = (0, import_react.useState)("");
	const [memFormMood, setMemFormMood] = (0, import_react.useState)("happy");
	const [memFormPic, setMemFormPic] = (0, import_react.useState)("");
	const [memFormStories, setMemFormStories] = (0, import_react.useState)(true);
	const [memFormSurprise, setMemFormSurprise] = (0, import_react.useState)(true);
	const [memFormTimeline, setMemFormTimeline] = (0, import_react.useState)(true);
	const [memFormSpin, setMemFormSpin] = (0, import_react.useState)(true);
	const handleAddMemory = () => {
		if (!memFormTitle || !memFormStory) {
			toast.error("Please add a memory title and story text 📖");
			return;
		}
		const updated = [{
			id: "mem_" + Date.now(),
			animalSlug: memFormPet,
			title: memFormTitle,
			story: memFormStory,
			image: memFormPic || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
			date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			}),
			location: animals$1.find((a) => a.slug === memFormPet)?.home || "Village Lane",
			mood: memFormMood,
			pawPrints: 1,
			showInStories: memFormStories,
			showInSurpriseBox: memFormSurprise,
			showInTimeline: memFormTimeline,
			showInSpinWheel: memFormSpin
		}, ...memories$1];
		saveCMSData(animals$1, updated, dialogues$1, quizQuestions$1, spinRewards$1, surprises$1);
		toast.success("New memory published and distributed! 🚀🌸");
		setMemFormTitle("");
		setMemFormStory("");
		setMemFormPic("");
	};
	const [diagPet, setDiagPet] = (0, import_react.useState)("coco");
	const [diagText, setDiagText] = (0, import_react.useState)("");
	const [diagEmotion, setDiagEmotion] = (0, import_react.useState)("funny");
	const handleAddDialogue = () => {
		if (!diagText) return;
		const updated = [{
			petSlug: diagPet,
			message: diagText,
			emotion: diagEmotion
		}, ...dialogues$1];
		saveCMSData(animals$1, memories$1, updated, quizQuestions$1, spinRewards$1, surprises$1);
		setDiagText("");
		toast.success("Dialogue registered to pet chat bubbles!");
	};
	const handleRemoveDialogue = (idx) => {
		const updated = dialogues$1.filter((_, i) => i !== idx);
		saveCMSData(animals$1, memories$1, updated, quizQuestions$1, spinRewards$1, surprises$1);
		toast.success("Dialogue entry deleted.");
	};
	const [spinLabel, setSpinLabel] = (0, import_react.useState)("");
	const [spinTitle, setSpinTitle] = (0, import_react.useState)("");
	const [spinContent, setSpinContent] = (0, import_react.useState)("");
	const [spinColor, setSpinColor] = (0, import_react.useState)("#FF6F61");
	const [spinIcon, setSpinIcon] = (0, import_react.useState)("🍪");
	const handleAddSpinReward = () => {
		if (!spinLabel || !spinContent) return;
		const newRew = {
			label: spinLabel,
			color: spinColor,
			icon: spinIcon,
			title: spinTitle || spinLabel,
			content: spinContent
		};
		const updated = [...spinRewards$1, newRew];
		saveCMSData(animals$1, memories$1, dialogues$1, quizQuestions$1, updated, surprises$1);
		setSpinLabel("");
		setSpinTitle("");
		setSpinContent("");
		toast.success("New segment added to Spin Wheel! 🎡");
	};
	const handleRemoveSpin = (idx) => {
		const updated = spinRewards$1.filter((_, i) => i !== idx);
		saveCMSData(animals$1, memories$1, dialogues$1, quizQuestions$1, updated, surprises$1);
		toast.success("Spin segment removed.");
	};
	const [surpTitle, setSurpTitle] = (0, import_react.useState)("");
	const [surpIcon, setSurpIcon] = (0, import_react.useState)("🎁");
	const [surpContent, setSurpContent] = (0, import_react.useState)("");
	const handleAddSurprise = () => {
		if (!surpTitle || !surpContent) return;
		const newSur = {
			title: surpTitle,
			icon: surpIcon,
			content: surpContent
		};
		const updated = [...surprises$1, newSur];
		saveCMSData(animals$1, memories$1, dialogues$1, quizQuestions$1, spinRewards$1, updated);
		setSurpTitle("");
		setSurpContent("");
		toast.success("Surprise pool card created!");
	};
	const handleRemoveSurprise = (idx) => {
		const updated = surprises$1.filter((_, i) => i !== idx);
		saveCMSData(animals$1, memories$1, dialogues$1, quizQuestions$1, spinRewards$1, updated);
		toast.success("Surprise card removed.");
	};
	const handleModerateSub = async (id, action) => {
		try {
			if (action === "approve") {
				await review({ data: {
					id,
					status: "approved"
				} });
				toast.success("Memory note approved on database! 🐾");
			} else {
				await review({ data: {
					id,
					status: "rejected"
				} });
				toast.success("Memory note rejected.");
			}
			const subs = await getPending();
			setLocalSubmissions(subs || []);
		} catch (err) {
			console.error(err);
			let updated;
			if (action === "approve") {
				updated = localSubmissions.map((s) => s.id === id ? {
					...s,
					status: "approved"
				} : s);
				toast.success("Memory note approved locally! 🐾");
			} else {
				updated = localSubmissions.filter((s) => s.id !== id);
				toast.success("Memory note removed locally.");
			}
			localStorage.setItem("pawbook-local-submissions", JSON.stringify(updated));
			setLocalSubmissions(updated);
			window.dispatchEvent(new Event("pawbook-local-sub-updated"));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "w-full shrink-0 md:w-64 rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-coffee/5 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl",
							children: "🐾"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-lg font-bold text-coffee",
							children: "Pet Studio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-coffee/50 font-bold uppercase tracking-wider",
							children: "Creator Center"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col gap-1",
						children: [
							{
								id: "dashboard",
								label: "🏠 Dashboard"
							},
							{
								id: "pets",
								label: "🐾 My Pets"
							},
							{
								id: "memories",
								label: "📖 Memories"
							},
							{
								id: "gallery",
								label: "📸 Gallery"
							},
							{
								id: "dialogues",
								label: "💬 Dialogues"
							},
							{
								id: "games",
								label: "🎡 Game Content"
							},
							{
								id: "moderation",
								label: "❤️ Visitor Wall"
							},
							{
								id: "settings",
								label: "⚙ Settings"
							}
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab(t.id),
							className: "w-full text-left rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer " + (activeTab === t.id ? "bg-coffee text-cream" : "text-coffee/85 hover:bg-cream/40"),
							children: t.label
						}, t.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-6 border-t border-coffee/5 mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleReset,
						className: "w-full rounded-xl border border-dashed border-destructive/30 py-2 text-[10px] font-bold text-destructive/80 hover:bg-destructive/5 cursor-pointer",
						children: "Reset Database Defaults 🔄"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-8",
				children: [
					activeTab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-coffee",
								children: "Overview Analytics"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/60",
								children: "Live metrics of your digital pet diary content."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl block mb-1",
												children: "🐾"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-bold font-display text-coffee",
												children: animals$1.length
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1",
												children: "Total Pets"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl block mb-1",
												children: "📖"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-bold font-display text-coffee",
												children: memories$1.length
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1",
												children: "Memories"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl block mb-1",
												children: "💬"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-bold font-display text-coffee",
												children: dialogues$1.length
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1",
												children: "Quotes"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl block mb-1",
												children: "❤️"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-bold font-display text-coffee",
												children: Object.values(loveStats).reduce((a, b) => a + b, 0) + Object.values(treatStats).reduce((a, b) => a + b, 0)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1",
												children: "Love Recieved"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-coffee/10 p-5 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg text-coffee",
									children: "Most Loved Village Pets"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: animals$1.map((a) => {
										const total = (loveStats[a.slug] || 0) + (treatStats[a.slug] || 0);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs border-b border-coffee/5 pb-2 last:border-b-0 last:pb-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg",
														children: a.emoji
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold",
														children: a.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-coffee/40",
														children: [
															"(",
															a.nickname,
															")"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-peach",
												children: [
													"❤️ ",
													total,
													" points"
												]
											})]
										}, a.slug);
									})
								})]
							})
						]
					}),
					activeTab === "pets" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-coffee",
								children: "Pet Profile Manager"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/60",
								children: "Update biography, nicknames, favorites, or current mood."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2 border-b border-coffee/5 pb-3 overflow-x-auto",
								children: animals$1.map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelectedPetIdx(idx),
									className: "rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 " + (selectedPetIdx === idx ? "bg-peach text-coffee" : "bg-cream/40 hover:bg-cream"),
									children: [
										a.emoji,
										" ",
										a.name
									]
								}, a.slug))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Pet Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormName,
											onChange: (e) => setPetFormName(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Emoji Avatar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormEmoji,
											onChange: (e) => setPetFormEmoji(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Subtitle Nickname"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormNickname,
											onChange: (e) => setPetFormNickname(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
												children: "Profile Photo (Base64 / URL)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: petFormPic,
												onChange: (e) => setPetFormPic(e.target.value),
												className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-[10px]"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex items-center gap-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/*",
													onChange: async (e) => {
														const file = e.target.files?.[0];
														if (file) {
															const b64 = await handleFileChange(file);
															setPetFormPic(b64);
														}
													},
													className: "text-[10px]"
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Biography Bio"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											value: petFormBio,
											onChange: (e) => setPetFormBio(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-medium"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Story Speech Vibe"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormStory,
											onChange: (e) => setPetFormStory(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Favorite Snack"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormFavFood,
											onChange: (e) => setPetFormFavFood(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Today's Mood Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormMood,
											onChange: (e) => setPetFormMood(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Last Seen Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormLastSeen,
											onChange: (e) => setPetFormLastSeen(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Age Est."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormAgeEst,
											onChange: (e) => setPetFormAgeEst(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Gender"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormGender,
											onChange: (e) => setPetFormGender(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Breed / Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormBreedType,
											onChange: (e) => setPetFormBreedType(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Known Since"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormKnownSince,
											onChange: (e) => setPetFormKnownSince(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Home Area"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: petFormHomeArea,
											onChange: (e) => setPetFormHomeArea(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2 grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer border border-coffee/10 bg-white p-2.5 rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: petFormVaccinated,
												onChange: (e) => setPetFormVaccinated(e.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-coffee/70",
												children: "Vaccinated 💉"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer border border-coffee/10 bg-white p-2.5 rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: petFormSterilized,
												onChange: (e) => setPetFormSterilized(e.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-coffee/70",
												children: "Sterilized ✂️"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Medical Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											value: petFormMedicalNotes,
											onChange: (e) => setPetFormMedicalNotes(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-medium"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2 grid grid-cols-2 gap-4 border-t border-coffee/5 pt-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[10px] font-bold text-coffee/60 uppercase",
													children: [
														"Friendliness (",
														petFormFriendliness,
														"%)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "0",
													max: "100",
													value: petFormFriendliness,
													onChange: (e) => setPetFormFriendliness(Number(e.target.value)),
													className: "w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[10px] font-bold text-coffee/60 uppercase",
													children: [
														"Energy (",
														petFormEnergy,
														"%)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "0",
													max: "100",
													value: petFormEnergy,
													onChange: (e) => setPetFormEnergy(Number(e.target.value)),
													className: "w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[10px] font-bold text-coffee/60 uppercase",
													children: [
														"Trust (",
														petFormTrust,
														"%)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "0",
													max: "100",
													value: petFormTrust,
													onChange: (e) => setPetFormTrust(Number(e.target.value)),
													className: "w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[10px] font-bold text-coffee/60 uppercase",
													children: [
														"Playfulness (",
														petFormPlayfulness,
														"%)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "0",
													max: "100",
													value: petFormPlayfulness,
													onChange: (e) => setPetFormPlayfulness(Number(e.target.value)),
													className: "w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2 border-t border-coffee/5 pt-4 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-2",
												children: [
													"Medical / Health Journal History (",
													petFormHealthRecords.length,
													" Entries)"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1",
												children: petFormHealthRecords.map((h, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-center bg-cream/30 p-2 border border-coffee/5 rounded-xl text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold",
															children: [
																"[",
																h.date,
																"]"
															]
														}),
														" ",
														h.type,
														" — ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-coffee/85",
															children: h.note
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleRemoveHealth(idx),
														type: "button",
														className: "text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 cursor-pointer",
														children: "×"
													})]
												}, idx))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 items-center bg-cream/10 p-2.5 rounded-xl border border-dashed border-coffee/10",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Date (e.g. Jul 20)",
														value: newHealthDate,
														onChange: (e) => setNewHealthDate(e.target.value),
														className: "w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: newHealthType,
														onChange: (e) => setNewHealthType(e.target.value),
														className: "w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Vaccination" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Checkup" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medication" })
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Description / note",
														value: newHealthNote,
														onChange: (e) => setNewHealthNote(e.target.value),
														className: "flex-1 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: handleAddHealth,
														type: "button",
														className: "bg-coffee text-cream font-bold text-xs px-3 py-1 rounded-lg cursor-pointer shrink-0",
														children: "Add"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2 border-t border-coffee/5 pt-4 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-2",
												children: [
													"Care Journey Milestones (",
													petFormCareTimeline.length,
													" Entries)"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1",
												children: petFormCareTimeline.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-center bg-cream/30 p-2 border border-coffee/5 rounded-xl text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold",
															children: [
																"[",
																t.date,
																"]"
															]
														}),
														" ",
														t.label,
														" — ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-coffee/85",
															children: t.note
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleRemoveCare(idx),
														type: "button",
														className: "text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 cursor-pointer",
														children: "×"
													})]
												}, idx))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 items-center bg-cream/10 p-2.5 rounded-xl border border-dashed border-coffee/10",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Date (e.g. Apr 4)",
														value: newCareDate,
														onChange: (e) => setNewCareDate(e.target.value),
														className: "w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Event title",
														value: newCareLabel,
														onChange: (e) => setNewCareLabel(e.target.value),
														className: "w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Description note",
														value: newCareNote,
														onChange: (e) => setNewCareNote(e.target.value),
														className: "flex-1 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: handleAddCare,
														type: "button",
														className: "bg-coffee text-cream font-bold text-xs px-3 py-1 rounded-lg cursor-pointer shrink-0",
														children: "Add"
													})
												]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleUpdatePetProfile,
								className: "w-full mt-4 rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-103 cursor-pointer",
								children: "Save Pet Profile Overrides 💾"
							})
						]
					}),
					activeTab === "memories" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-coffee",
								children: "Memory Publisher"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/60",
								children: "Publish a new card and choose which game features it feeds."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Select Pet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: memFormPet,
											onChange: (e) => setMemFormPet(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold",
											children: animals$1.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: a.slug,
												children: a.name
											}, a.slug))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Memory Tone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: memFormMood,
											onChange: (e) => setMemFormMood(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "happy",
													children: "Funny 😂"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "emotional",
													children: "Emotional ❤️"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "rescue",
													children: "Childhood 🍼"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "funny",
													children: "Naughty 😈"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "night",
													children: "Adventure 🌎"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Memory Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "e.g. Biscuit Crime Spot",
											value: memFormTitle,
											onChange: (e) => setMemFormTitle(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
												children: "Photo / Asset (Drag file or url)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												placeholder: "Image URL",
												value: memFormPic,
												onChange: (e) => setMemFormPic(e.target.value),
												className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-[10px]"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												onChange: async (e) => {
													const file = e.target.files?.[0];
													if (file) {
														const b64 = await handleFileChange(file);
														setMemFormPic(b64);
													}
												},
												className: "mt-2 text-[10px]"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Diary Narrative"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 3,
											placeholder: "Tell the story of what happened...",
											value: memFormStory,
											onChange: (e) => setMemFormStory(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-medium"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-coffee/5 bg-cream/10 p-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-2",
									children: "Auto-Distribution Targets"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-xs font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: memFormStories,
												onChange: (e) => setMemFormStories(e.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Instagram Stories Viewer" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: memFormSurprise,
												onChange: (e) => setMemFormSurprise(e.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Daily Surprise Box Pool" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: memFormTimeline,
												onChange: (e) => setMemFormTimeline(e.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pet profile timeline" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: memFormSpin,
												onChange: (e) => setMemFormSpin(e.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Spin Wheel prize drop" })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleAddMemory,
								className: "w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-103 cursor-pointer",
								children: "Publish and Distribute Memory 🚀🌸"
							})
						]
					}),
					activeTab === "gallery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl text-coffee",
							children: "Central Media Gallery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-coffee/60",
							children: "Upload once, view all assets categorized by pet."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 sm:grid-cols-3",
							children: [memories$1.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative rounded-2xl border border-coffee/5 p-2 bg-cream/10 shadow-sm overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: m.image,
									alt: "",
									className: "h-28 w-full object-cover rounded-lg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-3 left-3 rounded bg-coffee/85 text-[8px] font-bold text-cream px-1.5 py-0.5",
									children: m.animalSlug
								})]
							}, m.id)), animals$1.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative rounded-2xl border border-coffee/5 p-2 bg-cream/10 shadow-sm overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: a.image,
									alt: "",
									className: "h-28 w-full object-cover rounded-lg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute bottom-3 left-3 rounded bg-peach text-[8px] font-bold text-coffee px-1.5 py-0.5",
									children: [a.name, " Profile"]
								})]
							}, a.slug))]
						})]
					}),
					activeTab === "dialogues" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-coffee",
								children: "Dialogue Editor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/60",
								children: "Edit chat bubble dialogue prompts and responses."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Select Pet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: diagPet,
											onChange: (e) => setDiagPet(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold",
											children: animals$1.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: a.slug,
												children: a.name
											}, a.slug))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Dialogue Vibe Tone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: diagEmotion,
											onChange: (e) => setDiagEmotion(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "funny",
													children: "Funny 😂"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "happy",
													children: "Cute/Happy ❤️"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "attitude",
													children: "Attitude 😼"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "sleepy",
													children: "Sleepy 😴"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
											children: "Dialogue Text"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "e.g. If you have snacks, we are already friends 🍪",
											value: diagText,
											onChange: (e) => setDiagText(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleAddDialogue,
								className: "w-full mt-2 rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-103 cursor-pointer",
								children: "Register Dialogue Response 💬"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-coffee/10 p-4 mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-3",
									children: "Custom Dialogue Registry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: dialogues$1.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs border-b border-coffee/5 pb-2 last:border-b-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-peach uppercase text-[9px] mr-2",
											children: [
												"[",
												d.petSlug,
												"]"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "italic",
											children: [
												"\"",
												d.message,
												"\""
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleRemoveDialogue(i),
											className: "text-[10px] font-bold text-destructive hover:underline cursor-pointer",
											children: "Remove"
										})]
									}, i))
								})]
							})
						]
					}),
					activeTab === "games" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-coffee",
								children: "Game Asset curation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/60",
								children: "Customize segments for the Spin Wheel and items inside the Surprise Box."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-coffee/10 p-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg text-coffee border-b border-coffee/5 pb-2",
										children: "🎡 Spin Wheel Wedges"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Wedge Label"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													placeholder: "Moti's Adventure",
													value: spinLabel,
													onChange: (e) => setSpinLabel(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Icon"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: spinIcon,
													onChange: (e) => setSpinIcon(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Reward Card Title"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													placeholder: "Moti Chasing Leaves",
													value: spinTitle,
													onChange: (e) => setSpinTitle(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Description Text"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													placeholder: "Wrote details here...",
													value: spinContent,
													onChange: (e) => setSpinContent(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleAddSpinReward,
										className: "w-full rounded-xl bg-coffee py-2 text-xs font-bold text-cream cursor-pointer",
										children: "Add Wedge Segment 🎡"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 max-h-40 overflow-y-auto pt-2 border-t border-coffee/5",
										children: spinRewards$1.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												s.icon,
												" ",
												s.label
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleRemoveSpin(i),
												className: "text-[10px] font-bold text-destructive hover:underline cursor-pointer",
												children: "Delete"
											})]
										}, i))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-coffee/10 p-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg text-coffee border-b border-coffee/5 pb-2",
										children: "🎁 Daily Surprise Box Pool"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Card Title"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: surpTitle,
													onChange: (e) => setSurpTitle(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Icon"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: surpIcon,
													onChange: (e) => setSurpIcon(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-coffee/50 uppercase tracking-wider",
													children: "Surprise Fact Content"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: surpContent,
													onChange: (e) => setSurpContent(e.target.value),
													className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleAddSurprise,
										className: "w-full rounded-xl bg-coffee py-2 text-xs font-bold text-cream cursor-pointer",
										children: "Add Surprise Card 🎁"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 max-h-40 overflow-y-auto pt-2 border-t border-coffee/5",
										children: surprises$1.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												s.icon,
												" ",
												s.title
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleRemoveSurprise(i),
												className: "text-[10px] font-bold text-destructive hover:underline cursor-pointer",
												children: "Delete"
											})]
										}, i))
									})
								]
							})
						]
					}),
					activeTab === "moderation" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl text-coffee",
							children: "Visitor Love Wall Moderation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-coffee/60",
							children: "Approve or hide submissions posted to your local scrapbook."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [localSubmissions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/50 italic text-center py-6",
								children: "No visitor submissions to moderate yet."
							}), localSubmissions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row gap-4 border border-coffee/10 p-4 rounded-2xl bg-cream/5 justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s.photo_url,
										alt: "",
										className: "size-16 object-cover rounded-lg shrink-0 border border-coffee/5"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "font-display text-sm text-coffee",
											children: [
												s.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-coffee/5 uppercase",
													children: s.species
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-coffee/50",
											children: [
												"📍 ",
												s.location,
												" · ",
												s.created_at.split("T")[0]
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-coffee/85 mt-2 italic",
											children: [
												"\"",
												s.story,
												"\""
											]
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex sm:flex-col justify-end gap-2 shrink-0",
									children: [s.status !== "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleModerateSub(s.id, "approve"),
										className: "rounded bg-sage px-3 py-1 text-[10px] font-bold text-coffee cursor-pointer",
										children: "Approve"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-center rounded border border-sage text-sage px-3 py-1 text-[10px] font-bold",
										children: "Approved"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleModerateSub(s.id, "delete"),
										className: "rounded bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive hover:bg-destructive/15 cursor-pointer",
										children: "Delete"
									})]
								})]
							}, s.id))]
						})]
					}),
					activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl text-coffee",
							children: "Database Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-coffee/60",
							children: "Maintenance features and custom resets."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-coffee/10 p-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg text-coffee border-b border-coffee/5 pb-2",
									children: "CMS Initialization"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-coffee/70 leading-relaxed",
									children: "This studio uses local browser database variables synced to your browser session. If you want to delete all customizations and restore default configurations, click reset."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleReset,
									className: "rounded-xl bg-destructive py-2 px-4 text-xs font-bold text-cream hover:bg-destructive/90 cursor-pointer",
									children: "Restore Defaults 🔄"
								})
							]
						})]
					})
				]
			})]
		})
	}) });
}
//#endregion
export { PetStudioPage as component };
