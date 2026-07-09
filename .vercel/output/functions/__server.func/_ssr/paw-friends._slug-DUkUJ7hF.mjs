import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useCMS } from "./pawbook-data-CqSvBvet.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as PageShell } from "./SiteChrome-D0iB99sW.mjs";
import { t as Route } from "./paw-friends._slug-BcArvlcw.mjs";
import { t as shareContent } from "./utils-CXLS34TX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paw-friends._slug-DUkUJ7hF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var animalTimelines = {
	coco: [
		{
			date: "Apr 4",
			label: "🐾 Birthday Boy",
			note: "Celebrated Coco's 7th birthday in the garden."
		},
		{
			date: "May 10",
			label: "🐯 Tiger Look",
			note: "Discovered his unique tiger-like coat pattern."
		},
		{
			date: "Jul 15",
			label: "❤️ Too Friendly",
			note: "Coco welcomed every visitor with tail wags and happy jumps."
		}
	],
	moti: [
		{
			date: "Mar 3",
			label: "🐶 Corner Guard",
			note: "Found Moti watching over the tea shop corner."
		},
		{
			date: "Apr 20",
			label: "❤️ Belly Rub Pact",
			note: "Moti demanded belly rubs from every customer."
		},
		{
			date: "Jul 20",
			label: "💊 Healthy Pup",
			note: "Vet health check: Moti is healthy and safe!"
		}
	],
	kitty: [
		{
			date: "Feb 22",
			label: "🐈 Balcony Sighting",
			note: "Kitty watched us silently from the library balcony."
		},
		{
			date: "May 10",
			label: "🌸 Butterfly Hunt",
			note: "Sat in complete silence with a butterfly friend."
		},
		{
			date: "Jun 30",
			label: "🥛 Rooftop Feast",
			note: "Gave her grilled fish to celebrate the summer heat."
		}
	],
	tommy: [
		{
			date: "May 5",
			label: "🐕 Tiny Adventurer",
			note: "Found Tommy running after a leaf at just 3 months old."
		},
		{
			date: "Jul 10",
			label: "⛈️ Storm Rescue",
			note: "Sheltered under the tea shop stall during a heavy monsoon."
		},
		{
			date: "Jul 12",
			label: "🧣 Warm Blanket",
			note: "A kind visitor dried him off and gave him a cozy blanket."
		}
	]
};
function AnimalProfile() {
	const { animals, memories } = useCMS();
	const data = Route.useLoaderData();
	const a = animals.find((pet) => pet.slug === data.animal.slug) || data.animal;
	animalTimelines[a.slug];
	const theirMemories = memories.filter((m) => m.animalSlug === a.slug);
	a.status === "safe" || a.status;
	a.status === "safe" || a.status;
	const [extraLove, setExtraLove] = (0, import_react.useState)(0);
	const [extraTreats, setExtraTreats] = (0, import_react.useState)(0);
	const [accessory, setAccessory] = (0, import_react.useState)(null);
	const [comments, setComments] = (0, import_react.useState)([]);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newIcon, setNewIcon] = (0, import_react.useState)("🐶");
	const [newMessage, setNewMessage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const key = `pawbook-guestbook-${a.slug}`;
		const saved = localStorage.getItem(key);
		if (saved) try {
			setComments(JSON.parse(saved));
		} catch (e) {
			console.error(e);
		}
		else {
			const defaults = [{
				name: "Moti",
				icon: "🐶",
				message: `Hey ${a.name}, let's share biscuits together tomorrow near the tea stall! 🍪`,
				date: "Just now"
			}, {
				name: "Kitty",
				icon: "🐈",
				message: `Stay cozy, ${a.name}! The sun is warm on the library balcony today. ☀️`,
				date: "1 hour ago"
			}];
			setComments(defaults);
			localStorage.setItem(key, JSON.stringify(defaults));
		}
		const loveKey = `pawbook-extra-love-${a.slug}`;
		const treatsKey = `pawbook-extra-treats-${a.slug}`;
		setExtraLove(parseInt(localStorage.getItem(loveKey) || "0", 10));
		setExtraTreats(parseInt(localStorage.getItem(treatsKey) || "0", 10));
		setAccessory(localStorage.getItem(`pawbook-accessory-${a.slug}`));
		const stampsKey = "pawbook-visited-stamps";
		const visitedStr = localStorage.getItem(stampsKey) || "[]";
		try {
			const visited = JSON.parse(visitedStr);
			if (!visited.includes(a.slug)) {
				const next = [...visited, a.slug];
				localStorage.setItem(stampsKey, JSON.stringify(next));
				window.dispatchEvent(new Event("pawbook-stamp-updated"));
				toast.success(`New stamp added to your Village Passport: ${a.name}! 💮`);
			}
		} catch (e) {
			console.error(e);
		}
	}, [a.slug, a.name]);
	const handleGuestbookSubmit = (e) => {
		e.preventDefault();
		if (!newName.trim() || !newMessage.trim()) return;
		const updated = [{
			name: newName.trim(),
			icon: newIcon,
			message: newMessage.trim(),
			date: "Just now"
		}, ...comments];
		setComments(updated);
		localStorage.setItem(`pawbook-guestbook-${a.slug}`, JSON.stringify(updated));
		setNewName("");
		setNewMessage("");
		toast.success(`Greeting sent to ${a.name}! 🐾`);
	};
	const handleShare = () => {
		shareContent({
			title: `${a.name} ${a.emoji} · PawBook`,
			text: `Meet ${a.name}, "${a.nickname}" on PawBook! 🐾`,
			url: window.location.href
		}, () => toast.success("Shared successfully! 🐾"), () => toast.error("Could not share automatically. Please copy the URL from your browser address bar."));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					hash: "paw-friends",
					className: "absolute top-4 left-4 sm:top-6 sm:left-6 z-30 group flex items-center gap-2 rounded-2xl border-2 border-dashed border-peach/50 bg-white px-3 py-1.5 sm:px-4 sm:py-2 font-display text-xs sm:text-sm font-bold text-coffee scrapbook-shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm sm:text-base group-hover:-translate-x-0.5 transition-transform",
						children: "🏡 🐾"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Return to Village" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `relative h-56 sm:h-72 md:h-80 bg-${a.color}/60`,
					style: { backgroundImage: "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--color-peach) 30%, transparent), transparent 40%), radial-gradient(circle at 80% 60%, color-mix(in oklab, var(--color-sky) 40%, transparent), transparent 50%)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 text-9xl",
						children: a.emoji
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto -mt-20 max-w-5xl px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-start gap-6 sm:flex-row sm:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "washi-tape-wrap relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-3 left-1/2 z-20 h-6 w-20 -translate-x-1/2 rotate-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-full border-8 border-white bg-white scrapbook-shadow relative overflow-hidden size-40 sm:size-48 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: a.image,
									alt: a.name,
									className: "h-full w-full object-cover",
									style: a.slug === "coco" ? { objectPosition: "center 25%" } : void 0,
									width: 400,
									height: 400
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-hand text-2xl text-peach",
									children: [
										"\"",
										a.nickname,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display text-4xl sm:text-5xl md:text-6xl",
									children: [
										a.name,
										" ",
										a.emoji
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-xl text-base text-coffee/80",
									children: a.bio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap items-center gap-3",
									children: [a.badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-white px-3 py-1 text-xs font-bold scrapbook-shadow",
										children: b
									}, b)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleShare,
										className: "rounded-full bg-coffee px-3.5 py-1 text-xs font-bold text-cream hover:bg-peach hover:text-coffee transition-colors scrapbook-shadow cursor-pointer",
										children: "🔗 Share Friend"
									})]
								})
							]
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 md:col-span-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-2 bottom-2 text-6xl opacity-5 pointer-events-none rotate-12",
								children: "🪪"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3",
								children: "🪪 Paw Passport"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 text-xs text-coffee/85",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-coffee/5 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
											children: "PawBook ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-sm font-bold text-coffee",
											children: a.pawId || `PB-${a.slug.toUpperCase()}-1024`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
											children: "Age Est."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: a.ageEstimate || "N/A"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
											children: "Gender"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: a.gender || "N/A"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
										children: "Breed / Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: a.breedType || a.personality
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
											children: "Known Since"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: a.knownSince || a.firstMet
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
											children: "Home Area"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold truncate",
											children: a.homeArea || a.home
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-coffee/5 pt-3 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] uppercase tracking-wider text-coffee/40 font-bold",
												children: "Health Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${a.vaccinated ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`,
													children: ["💉 ", a.vaccinated ? "Vaccinated" : "Needs Vaccine"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${a.sterilized ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`,
													children: ["✂️ ", a.sterilized ? "Sterilized" : "Not Sterilized"]
												})]
											}),
											a.medicalNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-coffee/70 bg-cream/30 p-2 rounded-xl border border-coffee/5 italic",
												children: [
													"\"",
													a.medicalNotes,
													"\""
												]
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3",
							children: "📊 Personality Meter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] font-bold text-coffee/70 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Friendliness" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.friendliness || 80, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-peach rounded-full",
										style: { width: `${a.friendliness || 80}%` }
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] font-bold text-coffee/70 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Energy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.energy || 70, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-yellow rounded-full",
										style: { width: `${a.energy || 70}%` }
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] font-bold text-coffee/70 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trust" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.trust || 85, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-sage rounded-full",
										style: { width: `${a.trust || 85}%` }
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] font-bold text-coffee/70 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Playfulness" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.playfulness || 75, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-peach rounded-full",
										style: { width: `${a.playfulness || 75}%` }
									})
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border-2 border-dashed border-peach/50 bg-[#FDFBF7] p-5 scrapbook-shadow text-center relative overflow-hidden flex flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-2",
								children: "🏷️ QR Paw Tag"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] font-mono font-bold text-coffee",
								children: ["ID: ", a.pawId || `PB-${a.slug.toUpperCase()}-1024`]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "my-4 size-28 bg-white border border-coffee/10 rounded-2xl p-2.5 flex items-center justify-center scrapbook-shadow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "size-full bg-coffee opacity-85 relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 grid grid-cols-5 gap-1 p-1 opacity-70",
											children: Array.from({ length: 25 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `rounded-sm ${idx * 7 % 3 === 0 ? "bg-coffee" : "bg-transparent"}` }, idx))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-1 left-1 size-5 border-2 border-coffee bg-white p-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-coffee" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-1 right-1 size-5 border-2 border-coffee bg-white p-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-coffee" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute bottom-1 left-1 size-5 border-2 border-coffee bg-white p-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-coffee" })
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-coffee/60 leading-tight",
								children: [
									"Scan tag or print to place near ",
									a.name,
									"'s feeding spot so anyone can read their story."
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 md:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-4 right-6 text-2xl rotate-6 animate-float",
								children: "✍️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-2",
								children: "My Story"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-[radial-gradient(circle_at_0px_0px,transparent_8px,transparent_8px),linear-gradient(#00000008_1px,transparent_1px)] bg-size-[100%_24px] pl-1 py-1.5 mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-hand text-2xl leading-relaxed text-coffee",
									children: [
										"\"",
										a.story || `Hi, I am ${a.name} 🐾 Every morning I wait near the tea shop because my friends come to meet me.`,
										"\""
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-[10px] uppercase tracking-widest text-coffee/40 text-right",
								children: ["— Logged by protectors at the ", a.home]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold text-coffee",
									children: "Care Journey"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-coffee/40",
									children: "Milestones"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "relative space-y-4 border-l-2 border-dashed border-peach/50 pl-5",
								children: (a.careTimeline || []).map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute left-[-29px] top-0 flex size-5 items-center justify-center rounded-full bg-peach/20 text-xs border border-peach/40",
											children: "🐾"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[8px] font-bold uppercase tracking-wider text-coffee/40",
											children: t.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-base font-bold text-coffee",
											children: t.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-coffee/70 leading-normal",
											children: t.note
										})
									]
								}, idx))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold text-coffee",
									children: "Health Records"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-coffee/40",
									children: "History 🏥"
								})]
							}), !a.healthRecords || a.healthRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-coffee/50",
								children: "No health events recorded yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "relative space-y-4 border-l-2 border-dashed border-sage/50 pl-5",
								children: a.healthRecords.map((h, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute left-[-29px] top-0 flex size-5 items-center justify-center rounded-full bg-sage/20 text-xs border border-sage/40",
											children: "🏥"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[8px] font-bold uppercase tracking-wider text-coffee/40",
											children: h.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display text-base font-bold text-coffee flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.type }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: h.type === "Vaccination" ? "💉" : h.type === "Checkup" ? "🩺" : "💊"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-coffee/70 leading-normal",
											children: h.note
										})
									]
								}, idx))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-coffee/10 bg-white p-6 scrapbook-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-4 font-display text-2xl",
							children: [a.name, "'s Memories"]
						}), theirMemories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-coffee/60",
							children: "No memories saved yet. Come back soon!"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: theirMemories.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-xl border border-coffee/5 bg-cream/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-video overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: m.image,
										alt: m.title,
										loading: "lazy",
										className: "h-full w-full object-cover",
										style: a.slug === "coco" ? { objectPosition: "center 25%" } : void 0
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg",
											children: m.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-coffee/60",
											children: [
												m.date,
												" · ",
												m.location
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 font-hand text-lg text-coffee/80",
											children: [
												"\"",
												m.story,
												"\""
											]
										})
									]
								})]
							}, m.id))
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-5xl px-6 pb-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl mb-1",
						children: "🐾 Pet Guestbook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-coffee/70 mb-6",
						children: [
							"Connecting with friends! Let ",
							a.name,
							" know your pet visited them."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleGuestbookSubmit,
							className: "space-y-4 rounded-2xl bg-cream/40 p-5 border border-coffee/5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg",
									children: "Leave a Hello"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "sm:col-span-2 text-xs font-semibold",
										children: ["Your Pet's Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											type: "text",
											maxLength: 30,
											value: newName,
											onChange: (e) => setNewName(e.target.value),
											placeholder: "e.g. Rocky",
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-peach"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold",
										children: ["Pet Icon", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: newIcon,
											onChange: (e) => setNewIcon(e.target.value),
											className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-peach",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐶" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐈" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐹" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐰" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🦁" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🦊" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🦝" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐼" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐻" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "🐷" })
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold",
									children: ["Message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										maxLength: 200,
										rows: 3,
										value: newMessage,
										onChange: (e) => setNewMessage(e.target.value),
										placeholder: `Send ${a.name} some warm updates!`,
										className: "mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-peach"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "w-full rounded-full bg-coffee py-2 text-xs font-bold text-cream hover:bg-peach hover:text-coffee transition-colors cursor-pointer",
									children: "Send Greeting 💌"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 max-h-[340px] overflow-y-auto pr-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-lg",
									children: [
										"Greetings (",
										comments.length,
										")"
									]
								}),
								comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-coffee/50 italic",
									children: "Be the first to say hello!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: comments.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative rounded-2xl border border-coffee/5 bg-cream/20 p-4 scrapbook-shadow",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-2 left-4 h-4 w-12 rotate-2 opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl",
												children: c.icon
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-bold",
													children: c.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 font-hand text-lg text-coffee/80 leading-snug",
													children: [
														"\"",
														c.message,
														"\""
													]
												})]
											})]
										})]
									}, i))
								})
							]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-6 pb-16 pt-8 text-center sm:text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				hash: "paw-friends",
				className: "inline-flex items-center gap-2 rounded-2xl border border-coffee/15 bg-white px-5 py-3 font-display text-sm font-bold text-coffee scrapbook-shadow transition hover:scale-105 active:scale-95 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏡 ⬅️" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Village Scrapbook" })]
			})
		})
	] });
}
//#endregion
export { AnimalProfile as component };
