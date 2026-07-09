import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DehiQiIM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { l as surprises } from "./pawbook-data-CqSvBvet.mjs";
import { g as Link, l as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteChrome-D0iB99sW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user: session?.user ?? null,
		loading
	};
}
function DailySurpriseBox() {
	const surprises$1 = surprises;
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [hasOpenedToday, setHasOpenedToday] = (0, import_react.useState)(false);
	const [reward, setReward] = (0, import_react.useState)(null);
	const [bounce, setBounce] = (0, import_react.useState)(false);
	const [particles, setParticles] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const today = (/* @__PURE__ */ new Date()).toDateString();
		if (localStorage.getItem("pawbook-last-opened-surprise") === today) setHasOpenedToday(true);
		const timer = setInterval(() => {
			setBounce(true);
			setTimeout(() => setBounce(false), 2e3);
		}, 1e4);
		return () => clearInterval(timer);
	}, []);
	const handleOpen = () => {
		const random = surprises$1[Math.floor(Math.random() * surprises$1.length)];
		setReward(random);
		setIsOpen(true);
		const confettiList = Array.from({ length: 15 }).map((_, i) => ({
			id: i,
			left: `${5 + Math.random() * 90}%`,
			delay: `${Math.random() * 400}ms`,
			emoji: [
				"🌸",
				"🎉",
				"✨",
				"🍬",
				"🐾",
				"🎈",
				"🍪"
			][Math.floor(Math.random() * 7)]
		}));
		setParticles(confettiList);
		if (!hasOpenedToday) {
			const today = (/* @__PURE__ */ new Date()).toDateString();
			localStorage.setItem("pawbook-last-opened-surprise", today);
			setHasOpenedToday(true);
			toast.success("Surprise Box opened! ✨🎁");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(450px) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes spring-up {
          0% { transform: scale(0.35); opacity: 0; }
          70% { transform: scale(1.06); opacity: 0.95; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-spring-up {
          animation: spring-up 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      ` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed bottom-6 left-6 z-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleOpen,
				className: `flex items-center justify-center rounded-full border border-coffee bg-yellow p-3 scrapbook-shadow hover:scale-110 active:scale-95 group transition-all duration-300 hover:shadow-[0_0_15px_rgba(231,158,130,0.5)] cursor-pointer ${bounce ? "animate-bounce" : ""}`,
				title: "Daily Paw Surprise Box",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:-translate-y-1 block",
					children: "🎁"
				})
			})
		}),
		isOpen && reward && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in overflow-hidden",
			children: [particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-4 text-2xl pointer-events-none animate-fall z-50",
				style: {
					left: p.left,
					animationDelay: p.delay
				},
				children: p.emoji
			}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-sm rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8 animate-spring-up",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "washi-tape absolute -top-1.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsOpen(false),
						className: "absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer",
						children: "✖"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-6xl animate-pulse block my-4",
						children: reward.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-coffee leading-snug",
						children: reward.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-coffee/80 leading-relaxed bg-cream/40 rounded-2xl border border-coffee/5 p-4 font-hand text-xl",
						children: [
							"\"",
							reward.content,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsOpen(false),
							className: "w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-105 cursor-pointer",
							children: "Cozy! Close 🌸"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] text-coffee/40 font-semibold",
							children: "Come back tomorrow for another village surprise! 📆🐾"
						})]
					})
				]
			})]
		})
	] });
}
var navLinks = [
	{
		to: "/",
		hash: "home",
		label: "Home"
	},
	{
		to: "/",
		hash: "paw-book",
		label: "PawBook 🐾"
	},
	{
		to: "/",
		hash: "stories",
		label: "Memories 📖"
	},
	{
		to: "/",
		hash: "explore",
		label: "PawMap 🗺️"
	},
	{
		to: "/",
		hash: "found-friends",
		label: "Help Board 🚨"
	},
	{
		to: "/",
		hash: "garden",
		label: "Kindness Wall ❤️"
	},
	{
		to: "/pet-studio",
		hash: "",
		label: "Studio ⚙️"
	}
];
function TopNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const [activeSection, setActiveSection] = (0, import_react.useState)("home");
	const [passportOpen, setPassportOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (pathname !== "/") return;
		const sections = [
			"home",
			"paw-book",
			"stories",
			"garden",
			"found-friends",
			"explore"
		];
		const observerOptions = {
			root: null,
			rootMargin: "-25% 0px -55% 0px",
			threshold: 0
		};
		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) setActiveSection(entry.target.id);
			});
		};
		const observer = new IntersectionObserver(observerCallback, observerOptions);
		sections.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => {
			sections.forEach((id) => {
				const el = document.getElementById(id);
				if (el) observer.unobserve(el);
			});
		};
	}, [pathname]);
	const handleNavClick = (e, to, hash) => {
		if (pathname === "/") {
			if (hash) {
				e.preventDefault();
				const el = document.getElementById(hash);
				if (el) {
					el.scrollIntoView({ behavior: "smooth" });
					window.history.pushState(null, "", `/#${hash}`);
					setActiveSection(hash);
				} else if (to === "/") {
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});
					window.history.pushState(null, "", "/");
					setActiveSection("home");
				}
			} else if (to === "/") {
				e.preventDefault();
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
				window.history.pushState(null, "", "/");
				setActiveSection("home");
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "sticky top-4 z-40 px-4 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl scrapbook-shadow items-center justify-between gap-3 rounded-full border border-coffee/5 bg-white/85 px-4 py-2.5 backdrop-blur-md sm:px-8 sm:py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						onClick: (e) => handleNavClick(e, "/"),
						className: "flex shrink-0 items-center gap-2 font-display text-lg font-bold sm:text-xl group relative overflow-hidden px-2 py-0.5 rounded-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110",
							children: "🐾"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative overflow-hidden block",
							children: ["PawBook", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden items-center gap-7 text-sm font-semibold md:flex",
						children: navLinks.map((l) => {
							const active = pathname === "/" ? activeSection === l.hash : false;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: l.to,
								hash: l.hash,
								onClick: (e) => handleNavClick(e, l.to, l.hash),
								className: "relative py-1 transition-colors hover:text-peach group " + (active ? "text-peach font-bold" : "text-coffee"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-0 h-0.5 w-full bg-peach transition-transform duration-300 origin-center " + (active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100") })]
							}, l.hash);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-4 md:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPassportOpen(true),
							className: "squish flex items-center gap-1.5 py-1.5 px-3.5 rounded-full border border-coffee bg-[#fce4ec] text-xs font-bold text-coffee cursor-pointer",
							children: "🔖 Passport"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthAffordance, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPassportOpen(true),
							className: "flex h-9 w-9 items-center justify-center rounded-full border border-coffee/10 bg-[#fce4ec] text-sm hover:bg-[#fce4ec]/80 cursor-pointer mr-1",
							title: "Open Passport",
							children: "🔖"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileMenuOpen(!mobileMenuOpen),
							className: "flex h-9 w-9 items-center justify-center rounded-full border border-coffee/10 bg-white text-lg hover:bg-cream cursor-pointer",
							"aria-label": "Toggle menu",
							children: mobileMenuOpen ? "✖" : "☰"
						})]
					})
				]
			}),
			mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-coffee/10 bg-white/95 p-6 shadow-xl backdrop-blur-md md:hidden animate-fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 text-base font-semibold",
					children: [navLinks.map((l) => {
						const active = pathname === "/" ? activeSection === l.hash : false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							hash: l.hash,
							onClick: (e) => {
								setMobileMenuOpen(false);
								handleNavClick(e, l.to, l.hash);
							},
							className: "transition-colors py-1 " + (active ? "text-peach font-bold" : "text-coffee hover:text-peach"),
							children: l.label
						}, l.hash);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-coffee/10 pt-4 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setMobileMenuOpen(false);
								setPassportOpen(true);
							},
							className: "squish flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-coffee bg-[#fce4ec] text-xs font-bold text-coffee cursor-pointer",
							children: "🔖 Open Passport Booklet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthAffordance, {})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassportModal, {
				isOpen: passportOpen,
				onClose: () => setPassportOpen(false)
			})
		]
	});
}
function AuthAffordance() {
	const { user, loading } = useSession();
	const navigate = useNavigate();
	if (loading) return null;
	if (!user || !user.email) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/pet-studio",
				className: "rounded-full bg-peach px-3 py-1.5 text-xs font-bold text-coffee hover:scale-105 flex items-center gap-1 shadow-sm",
				title: "Pet Studio CMS Dashboard",
				children: "🎨 Studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/moderation",
				className: "hidden rounded-full border border-coffee/15 bg-white px-3 py-1.5 text-xs font-bold text-coffee/80 hover:bg-cream sm:inline-flex",
				title: "Moderation queue (admins only)",
				children: "🛡️ Mod"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: async () => {
					await supabase.auth.signOut();
					navigate({ to: "/" });
				},
				className: "rounded-full bg-coffee px-4 py-2 text-xs font-bold text-cream hover:bg-coffee/90 sm:px-5 sm:text-sm cursor-pointer",
				children: "Sign out"
			})
		]
	});
}
function SunlightOverlay() {
	const [offsetY, setOffsetY] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setOffsetY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 z-0 transition-transform duration-75 ease-out",
		style: {
			transform: `translateY(${offsetY * -.05}px) translateZ(0)`,
			background: "radial-gradient(1200px 600px at 100% 0%, color-mix(in oklab, var(--color-yellow) 45%, transparent) 0%, transparent 55%), radial-gradient(900px 500px at 0% 100%, color-mix(in oklab, var(--color-peach) 25%, transparent) 0%, transparent 60%)"
		}
	});
}
function CozyCassettePlayer() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [track, setTrack] = (0, import_react.useState)("none");
	const [audioNodes, setAudioNodes] = (0, import_react.useState)([]);
	const startAudio = (type) => {
		stopAudio();
		const WinAudioContext = window.webkitAudioContext;
		const AudioContextClass = window.AudioContext || WinAudioContext;
		if (!AudioContextClass) return;
		const ctx = new AudioContextClass();
		if (ctx.state === "suspended") ctx.resume();
		const nodesList = [ctx];
		if (type === "rain") {
			const bufferSize = ctx.sampleRate * 2;
			const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const output = noiseBuffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
			const whiteNoise = ctx.createBufferSource();
			whiteNoise.buffer = noiseBuffer;
			whiteNoise.loop = true;
			const filter = ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.setValueAtTime(450, ctx.currentTime);
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(.35, ctx.currentTime);
			whiteNoise.connect(filter);
			filter.connect(gain);
			gain.connect(ctx.destination);
			whiteNoise.start(0);
			nodesList.push(whiteNoise, filter, gain);
		} else if (type === "fire") {
			const bufferSize = ctx.sampleRate * 2;
			const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const output = noiseBuffer.getChannelData(0);
			let lastOut = 0;
			for (let i = 0; i < bufferSize; i++) {
				const white = Math.random() * 2 - 1;
				output[i] = (lastOut + .02 * white) / 1.02;
				lastOut = output[i];
				output[i] *= 3.5;
			}
			const brownNoise = ctx.createBufferSource();
			brownNoise.buffer = noiseBuffer;
			brownNoise.loop = true;
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(.25, ctx.currentTime);
			brownNoise.connect(gain);
			gain.connect(ctx.destination);
			brownNoise.start(0);
			nodesList.push(brownNoise, gain);
			nodesList.timer = setInterval(() => {
				if (Math.random() > .45) return;
				const osc = ctx.createOscillator();
				const popGain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.setValueAtTime(800 + Math.random() * 3e3, ctx.currentTime);
				popGain.gain.setValueAtTime(.08 * Math.random(), ctx.currentTime);
				popGain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .01 + Math.random() * .02);
				osc.connect(popGain);
				popGain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .04);
			}, 150);
		} else if (type === "chiptune") {
			const notes = [
				261.63,
				329.63,
				392,
				523.25,
				392,
				329.63
			];
			let noteIndex = 0;
			nodesList.timer = setInterval(() => {
				const osc = ctx.createOscillator();
				const synthGain = ctx.createGain();
				osc.type = "triangle";
				osc.frequency.setValueAtTime(notes[noteIndex], ctx.currentTime);
				synthGain.gain.setValueAtTime(.05, ctx.currentTime);
				synthGain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .45);
				osc.connect(synthGain);
				synthGain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .5);
				noteIndex = (noteIndex + 1) % notes.length;
			}, 300);
		}
		setAudioNodes(nodesList);
		setTrack(type);
		setIsPlaying(true);
	};
	const stopAudio = () => {
		if (audioNodes.length > 0) {
			const [ctx, ...nodes] = audioNodes;
			nodes.forEach((n) => {
				if (n instanceof AudioScheduledSourceNode) try {
					n.stop();
				} catch (e) {
					console.warn(e);
				}
			});
			const timer = audioNodes.timer;
			if (timer) clearInterval(timer);
			if (ctx instanceof AudioContext) try {
				ctx.close();
			} catch (e) {
				console.error(e);
			}
			setAudioNodes([]);
		}
		setIsPlaying(false);
		setTrack("none");
	};
	(0, import_react.useEffect)(() => {
		return () => {
			if (audioNodes.length > 0) {
				const [ctx, ...nodes] = audioNodes;
				nodes.forEach((n) => {
					if (n instanceof AudioScheduledSourceNode) try {
						n.stop();
					} catch (e) {
						console.warn(e);
					}
				});
				const timer = audioNodes.timer;
				if (timer) clearInterval(timer);
				if (ctx instanceof AudioContext) try {
					ctx.close();
				} catch (e) {
					console.error(e);
				}
			}
		};
	}, [audioNodes]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-24 left-6 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 4s linear infinite;
        }
      ` }), isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-64 rounded-3xl border border-coffee bg-white p-4 scrapbook-shadow flex flex-col gap-3 animate-spring-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-coffee/5 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: "📻"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold text-coffee",
							children: "Cozy Cassette Player"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsOpen(false),
						className: "text-xs font-bold text-coffee/40 hover:text-peach",
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-6 bg-cream/40 py-4 rounded-2xl border border-coffee/5 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 m-auto w-fit h-fit font-hand text-base text-coffee/45 z-10 select-none",
							children: track === "none" ? "TAPE IN" : track.toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-12 h-12 rounded-full border-4 border-double border-coffee/30 flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-coffee" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-12 h-12 rounded-full border-4 border-double border-coffee/30 flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-coffee" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-1 text-[10px] font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startAudio("chiptune"),
								className: `py-1.5 rounded-lg border transition-colors cursor-pointer text-center truncate ${track === "chiptune" ? "bg-coffee text-cream border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`,
								children: "🎵 Lofi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startAudio("rain"),
								className: `py-1.5 rounded-lg border transition-colors cursor-pointer text-center truncate ${track === "rain" ? "bg-coffee text-cream border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`,
								children: "🌧️ Rain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startAudio("fire"),
								className: `py-1.5 rounded-lg border transition-colors cursor-pointer text-center truncate ${track === "fire" ? "bg-coffee text-cream border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`,
								children: "🔥 Fire"
							})
						]
					}), isPlaying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: stopAudio,
						className: "w-full py-1 rounded-xl bg-peach/20 text-peach border border-peach/30 text-xs font-bold transition hover:bg-peach/30 cursor-pointer",
						children: "⏹️ Mute Player"
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsOpen(true),
			className: "flex h-12 w-12 items-center justify-center rounded-full border border-coffee bg-white scrapbook-shadow hover:scale-108 active:scale-95 transition-transform cursor-pointer group",
			title: "Open Cozy Audio Player",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xl group-hover:rotate-12 transition-transform",
				children: "📻"
			})
		})]
	});
}
function PageShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-cream text-coffee",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunlightOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "pb-6 md:pb-16",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailySurpriseBox, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CozyCassettePlayer, {})
		]
	});
}
function SiteFooter() {
	const [reduceMotion, setReduceMotion] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("pawbook-reduce-motion");
		const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (saved === "true" || saved === null && prefersReduce) {
			setReduceMotion(true);
			document.documentElement.classList.add("reduce-motion");
		}
	}, []);
	const toggleMotion = () => {
		const next = !reduceMotion;
		setReduceMotion(next);
		if (next) {
			document.documentElement.classList.add("reduce-motion");
			localStorage.setItem("pawbook-reduce-motion", "true");
			toast.success("Motion set to Low. Restoring quiet calmness 🍃");
		} else {
			document.documentElement.classList.remove("reduce-motion");
			localStorage.setItem("pawbook-reduce-motion", "false");
			toast.success("Motion set to Cozy. Bouncy animations active! 🐾✨");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "relative z-10 mt-6 md:mt-16 border-t border-coffee/10 bg-cream/60 px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-6 text-sm md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-display text-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐾" }), " PawBook"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xs text-coffee/70",
					children: "A cozy corner of the internet where every little life is remembered."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-coffee/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-coffee",
						children: "Wander around"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								hash: "paw-friends",
								className: "hover:text-peach",
								children: "Paw Friends"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								hash: "stories",
								className: "hover:text-peach",
								children: "Stories"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								hash: "garden",
								className: "hover:text-peach",
								children: "Kindness Garden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								hash: "explore",
								className: "hover:text-peach",
								children: "Paw World Map"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-coffee/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-coffee",
							children: "The human behind PawBook"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Built with technology and kindness by",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "font-bold text-peach hover:underline",
								children: "Sejal ❤️"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleMotion,
								className: "flex items-center gap-1.5 rounded-full border border-coffee/15 bg-white/80 px-3 py-1 text-xs font-bold text-coffee hover:bg-white transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: reduceMotion ? "🍃 Motion: Low" : "✨ Motion: Cozy" })
							})
						})
					]
				})
			]
		})
	});
}
function SectionHeading({ eyebrow, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 flex items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-bold uppercase tracking-[0.2em] text-coffee/50",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 font-display text-3xl sm:text-4xl",
			children: title
		})] }), action]
	});
}
function PassportModal({ isOpen, onClose }) {
	const [visited, setVisited] = (0, import_react.useState)([]);
	const [quizDone, setQuizDone] = (0, import_react.useState)(false);
	const [gardenerDone, setGardenerDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const savedVisited = localStorage.getItem("pawbook-visited-stamps");
		if (savedVisited) try {
			setVisited(JSON.parse(savedVisited));
		} catch (e) {
			console.error(e);
		}
		setQuizDone(localStorage.getItem("pawbook-quiz-completed") === "true");
		const flowerStates = localStorage.getItem("pawbook-flower-states") || "{}";
		try {
			const parsed = JSON.parse(flowerStates);
			const count = Object.keys(parsed).length;
			setGardenerDone(count >= 3);
		} catch (e) {
			console.error(e);
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const stampList = [
		{
			id: "coco",
			label: "Coco's Pact",
			emoji: "🍪",
			desc: "Visit Coco's Diary",
			unlocked: visited.includes("coco")
		},
		{
			id: "moti",
			label: "Moti's Rubs",
			emoji: "🐶",
			desc: "Visit Moti's Diary",
			unlocked: visited.includes("moti")
		},
		{
			id: "kitty",
			label: "Kitty's Balcony",
			emoji: "🐈",
			desc: "Visit Kitty's Diary",
			unlocked: visited.includes("kitty")
		},
		{
			id: "tommy",
			label: "Tommy's Path",
			emoji: "🧣",
			desc: "Visit Tommy's Diary",
			unlocked: visited.includes("tommy")
		},
		{
			id: "gardener",
			label: "Meadow Gardener",
			emoji: "🌸",
			desc: "Grow 3+ Garden Flowers",
			unlocked: gardenerDone
		},
		{
			id: "protector",
			label: "Village Protector",
			emoji: "💮",
			desc: "Complete Match Quiz",
			unlocked: quizDone
		}
	];
	const unlockedCount = stampList.filter((s) => s.unlocked).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes pageTurn {
          0% { transform: rotateY(-90deg); opacity: 0; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        .animate-page-turn {
          animation: pageTurn 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          transform-origin: left center;
        }
      ` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8 animate-page-turn",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 top-0 h-full w-4 bg-linear-to-r from-coffee/20 to-transparent border-r border-dashed border-coffee/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer",
					children: "✖"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-4xl block my-2",
					children: "💮"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl text-coffee",
					children: "Village Passport"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-coffee/60 mb-6",
					children: [
						"Your collected stamps from exploring the village (",
						unlockedCount,
						" / ",
						stampList.length,
						")"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 my-4 max-h-[300px] overflow-y-auto pr-1",
					children: stampList.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `p-3 rounded-2xl border text-center relative flex flex-col items-center justify-center transition-all ${s.unlocked ? "bg-[#fefae0] border-yellow shadow-sm" : "bg-cream/15 border-coffee/5 opacity-55"}`,
						children: [
							s.unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-1 right-1 text-[8px] bg-yellow border border-coffee/20 px-1 rounded font-bold text-coffee uppercase scale-90",
								children: "💮 Stamp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl mb-1",
								children: s.unlocked ? s.emoji : "❓"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-xs text-coffee truncate w-full",
								children: s.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] text-coffee/50 leading-tight mt-0.5",
								children: s.desc
							})
						]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-hand text-peach mt-4",
					children: "* Explore friends' profiles and complete playrooms to earn more stamps!"
				})
			]
		})]
	});
}
//#endregion
export { SectionHeading as n, useSession as r, PageShell as t };
