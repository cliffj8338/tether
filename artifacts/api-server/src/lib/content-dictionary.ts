type AlertLevel = "none" | "level1" | "level2" | "level3" | "level4" | "level5";

interface DictionaryEntry {
  pattern: RegExp;
  category: string;
  alertLevel: AlertLevel;
  reason: string;
}

const LEVEL5_ENTRIES: DictionaryEntry[] = [

  // === SEXUAL / EXPLICIT CONTENT ===
  { pattern: /\b(porn(o|ography)?|hentai|xxx|nsfw)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Explicit sexual content reference" },
  { pattern: /\b(nude|naked|nudes|noodz|n[o0][o0]dz)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Nudity reference" },
  { pattern: /\b(sex(ting|ts|ted)?|s[e3]xt)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Sexual content" },
  { pattern: /\b(d[i1]ck\s*(pic|pix)s?|boob(s|ies)|tit(s|ties))\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Explicit body part reference" },
  { pattern: /\b(orgasm|masturbat(e|ing|ion)|j(erk|ack)\s*(off|it))\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Explicit sexual reference" },
  { pattern: /\b(blow\s*job|hand\s*job|bj|hj)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Explicit sexual act reference" },
  { pattern: /\b(anal|oral\s*sex|vagina|penis|genitals?)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Explicit anatomical reference" },
  { pattern: /\b(horny|h[o0]rn[yie]|turned\s*on)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Sexual arousal reference" },
  { pattern: /\b(only\s*fans|onlyfans|of\s*account)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Adult platform reference" },
  { pattern: /\b(hookup|hook\s*up|smash|bang|f[*#@]ck|fck|fuk|fu[cq]k)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Sexual/profane content" },
  { pattern: /\b(cum(ming|s|med)?|c[u*]m)\b/i, category: "sexual_explicit", alertLevel: "level5", reason: "Explicit sexual reference" },
  { pattern: /\b(r[a@]pe|r[a@]p[i1]st|moles?t(ed|ing|er)?)\b/i, category: "sexual_violence", alertLevel: "level5", reason: "Sexual violence reference" },

  // === PREDATORY / GROOMING PATTERNS ===
  { pattern: /meet\s*(me|up)\s*(alone|secret(ly)?|private(ly)?|in\s*person)/i, category: "grooming", alertLevel: "level5", reason: "Predatory meetup attempt" },
  { pattern: /don'?t\s*tell\s*(your\s*)?(parents?|mom|dad|anyone|nobody)/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: secrecy from parents" },
  { pattern: /keep\s*(this|it)\s*(a\s*)?secret/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: secrecy" },
  { pattern: /our\s*(little|special)\s*secret/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: secrecy" },
  { pattern: /send\s*(me\s*)?(a\s*)?(pic(ture)?s?|photo(s)?|selfie(s)?|vid(eo)?s?)\s*(of\s*(you|your\s*(body|face|self)))?/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: soliciting images" },
  { pattern: /how\s*old\s*are\s*(you|u)\s*\?/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: age solicitation" },
  { pattern: /where\s*(do\s*)?(you|u)\s*(go\s*to\s*school|live|stay)/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: location solicitation" },
  { pattern: /what('?s|\s*is)\s*your\s*(address|school|phone|number)/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: personal info solicitation" },
  { pattern: /are\s*(you|u)\s*(home\s*)?alone/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: isolation check" },
  { pattern: /i('?ll| will)\s*(come|pick\s*(you\s*)?up|get\s*you)/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: arranging meetup" },
  { pattern: /you('?re|\s*are)\s*(so\s*)?(mature|grown\s*up|not\s*like\s*other\s*kids)/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: false maturity flattery" },
  { pattern: /age\s*is\s*just\s*a\s*number/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: age minimization" },
  { pattern: /your\s*parents?\s*(don'?t|wouldn'?t|won'?t)\s*understand/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: parent alienation" },
  { pattern: /delete\s*(this|the)\s*(chat|convo|message|text)/i, category: "grooming", alertLevel: "level5", reason: "Grooming pattern: evidence destruction" },

  // === DANGEROUS LINKS ===
  { pattern: /https?:\/\/[^\s]+\.(xxx|porn|adult|sex|cam)/i, category: "dangerous_link", alertLevel: "level5", reason: "Link to explicit content" },
  { pattern: /\b(chaturbate|xvideos|xhamster|pornhub|redtube|youporn|xnxx)\b/i, category: "dangerous_link", alertLevel: "level5", reason: "Adult website reference" },

  // === SEVERE PROFANITY ===
  { pattern: /\b(n[i1!]gg?(a|er|uh|ah?)|n[*@]gg[*@])\b/i, category: "slur", alertLevel: "level5", reason: "Racial slur" },
  { pattern: /\b(f[a@]gg?(ot|it|et)|f[*@]g)\b/i, category: "slur", alertLevel: "level5", reason: "Homophobic slur" },
  { pattern: /\b(ch[i1]nk|sp[i1]c|sp[i1]ck|w[e3]tback|k[i1]ke|g[o0][o0]k)\b/i, category: "slur", alertLevel: "level5", reason: "Racial/ethnic slur" },
  { pattern: /\b(wh[o0]re|sl[u*]t|sk[a@]nk|tr[a@]mp)\b/i, category: "slur", alertLevel: "level5", reason: "Sexually degrading slur" },
  { pattern: /\b(c[u*]nt|tw[a@]t)\b/i, category: "slur", alertLevel: "level5", reason: "Severe profanity" },
  { pattern: /\b(retard(ed)?|r[e3]t[a@]rd)\b/i, category: "slur", alertLevel: "level5", reason: "Ableist slur" },
];

const LEVEL4_ENTRIES: DictionaryEntry[] = [

  // === VIOLENCE / WEAPONS ===
  { pattern: /\b(kill\s*(you(rself)?|myself|him|her|them)|murder(ing)?|stab(bing)?|shoot(ing)?)\b/i, category: "violence", alertLevel: "level4", reason: "Violence threat or reference" },
  { pattern: /\b(gun|pistol|rifle|shotgun|ar[\s-]?15|glock|weapon(s)?|firearm)\b/i, category: "weapons", alertLevel: "level4", reason: "Weapon reference" },
  { pattern: /\b(knife|blade|sword|machete|brass\s*knuckles)\b/i, category: "weapons", alertLevel: "level4", reason: "Weapon reference" },
  { pattern: /\b(bomb|grenade|explosive|dynamite|c4)\b/i, category: "weapons", alertLevel: "level4", reason: "Explosive/weapon reference" },
  { pattern: /\b(beat\s*(you|him|her|them)\s*(up)?|punch\s*(you|him|her)|jump\s*(you|him|her))\b/i, category: "violence", alertLevel: "level4", reason: "Physical violence threat" },
  { pattern: /\b(blood(y)?|bleed(ing)?|gore|gory)\b/i, category: "violence", alertLevel: "level4", reason: "Violent/graphic content" },
  { pattern: /\bi('?ll|'?m\s*(gonna|going\s*to))\s*(hurt|destroy|end)\s*(you|him|her|them)/i, category: "violence", alertLevel: "level4", reason: "Threat of harm" },
  { pattern: /\b(school\s*shoot(ing|er)?|mass\s*shoot(ing|er)?|shoot\s*up)\b/i, category: "violence", alertLevel: "level4", reason: "Mass violence reference" },

  // === SELF-HARM / SUICIDE ===
  { pattern: /\b(sui?cide|su[i1]c[i1]de|s[*]icide)\b/i, category: "self_harm", alertLevel: "level4", reason: "Suicide reference" },
  { pattern: /\b(kill\s*myself|kms|kys|end\s*(my|it|my\s*life))\b/i, category: "self_harm", alertLevel: "level4", reason: "Self-harm / suicidal ideation" },
  { pattern: /\b(cut(ting)?\s*my\s*(wrist|arm|self)|self[\s-]?harm|self[\s-]?injury)\b/i, category: "self_harm", alertLevel: "level4", reason: "Self-harm reference" },
  { pattern: /\bwant\s*to\s*(die|disappear|not\s*(be\s*here|exist|wake\s*up))\b/i, category: "self_harm", alertLevel: "level4", reason: "Suicidal ideation" },
  { pattern: /\b(no\s*(one|body)\s*(would\s*)?care(s)?\s*if\s*i\s*(died|was\s*gone|wasn'?t\s*here))\b/i, category: "self_harm", alertLevel: "level4", reason: "Suicidal ideation" },
  { pattern: /\b(overdose|od'?d|od'?ing|swallow(ed)?\s*(pills|bleach))\b/i, category: "self_harm", alertLevel: "level4", reason: "Self-harm / overdose reference" },
  { pattern: /\b(anorexi[ac]|bulimi[ac]|purg(e|ing)|starv(e|ing)\s*(myself|my\s*body))\b/i, category: "self_harm", alertLevel: "level4", reason: "Eating disorder reference" },
  { pattern: /\b(i\s*hate\s*my\s*(life|self|body)|life\s*is\s*(pointless|worthless|meaningless))\b/i, category: "self_harm", alertLevel: "level4", reason: "Emotional distress indicator" },

  // === DRUGS / SUBSTANCES ===
  { pattern: /\b(weed|marijuana|cannabis|ganja|420|blunt|joint|edible(s)?|dab(s|bing)?)\b/i, category: "drugs", alertLevel: "level4", reason: "Marijuana/cannabis reference" },
  { pattern: /\b(cocaine|coke|crack|heroin|hero[i1]n|fentanyl|fent)\b/i, category: "drugs", alertLevel: "level4", reason: "Hard drug reference" },
  { pattern: /\b(meth|crystal\s*meth|methamphetamine|ice|crank|tweak)\b/i, category: "drugs", alertLevel: "level4", reason: "Methamphetamine reference" },
  { pattern: /\b(xanax|xan(s|ny)|perc(s|ocet)?|oxy(contin|codone)?|lean|codeine|promethazine)\b/i, category: "drugs", alertLevel: "level4", reason: "Prescription drug abuse reference" },
  { pattern: /\b(acid|lsd|shroom(s)?|mushroom(s)?|mdma|molly|ecstasy|e[\s-]?pill(s)?)\b/i, category: "drugs", alertLevel: "level4", reason: "Hallucinogen/party drug reference" },
  { pattern: /\b(vap(e|ing|er)|juul|puff\s*bar|nic|nicotine|cig(arette)?s?)\b/i, category: "drugs", alertLevel: "level4", reason: "Nicotine/vaping reference" },
  { pattern: /\b(drunk|wasted|hammered|sh[i1]t\s*faced|blacked\s*out|tipsy)\b/i, category: "alcohol", alertLevel: "level4", reason: "Alcohol intoxication reference" },
  { pattern: /\b(vodka|whiskey|tequila|beer|liquor|booze|hennessy|henny)\b/i, category: "alcohol", alertLevel: "level4", reason: "Alcohol reference" },
  { pattern: /\b(dealer|plug|connect|trap\s*house|stash)\b/i, category: "drugs", alertLevel: "level4", reason: "Drug dealing reference" },
  { pattern: /\b(high\s*af|getting\s*(high|lit|faded|loaded|zooted|fried))\b/i, category: "drugs", alertLevel: "level4", reason: "Drug use reference" },
  { pattern: /\b(pill(s|ie|ies)?|pop(ping)?\s*(pill|xan|perc))\b/i, category: "drugs", alertLevel: "level4", reason: "Pill/drug use reference" },

  // === STRONG PROFANITY ===
  { pattern: /\b(a[s$][s$]h[o0]le|a\s*\.\s*s\s*\.\s*s\s*hole)\b/i, category: "profanity", alertLevel: "level4", reason: "Strong profanity" },
  { pattern: /\b(b[i1!]tch(es|y)?|b[*@]tch|bi[+]ch)\b/i, category: "profanity", alertLevel: "level4", reason: "Strong profanity" },
  { pattern: /\b(motherf[*#@ucka]|mf|stfu|gtfo)\b/i, category: "profanity", alertLevel: "level4", reason: "Strong profanity" },
  { pattern: /\b(sh[i1!][t+]|sh[*@]t|$h!t|sht)\b/i, category: "profanity", alertLevel: "level4", reason: "Strong profanity" },
  { pattern: /\b(damn|goddamn|g[o0]ddamn)\b/i, category: "profanity", alertLevel: "level4", reason: "Strong profanity" },
  { pattern: /\b(d[i1]ck|d[*@]ck|c[o0]ck|prick|dong)\b/i, category: "profanity", alertLevel: "level4", reason: "Vulgar language" },
  { pattern: /\b(wtf|wth|omfg|lmfao)\b/i, category: "profanity", alertLevel: "level4", reason: "Profane abbreviation" },
  { pattern: /\b(p[i1]ss(ed)?|p[*@]ss)\b/i, category: "profanity", alertLevel: "level4", reason: "Vulgar language" },
  { pattern: /\b(a[s$][s$]|a[s$]{2}|@ss|a\$\$)\b/i, category: "profanity", alertLevel: "level4", reason: "Profanity" },

  // === GAMBLING ===
  { pattern: /\b(gambling|bet(ting)?\s*site|online\s*casino|slots|poker\s*app)\b/i, category: "gambling", alertLevel: "level4", reason: "Gambling reference" },
];

const LEVEL3_ENTRIES: DictionaryEntry[] = [

  // === BULLYING / INSULTS ===
  { pattern: /\b(stupid|st[u*]pid|stoopid|stu+pid)\b/i, category: "bullying", alertLevel: "level3", reason: "Insulting language" },
  { pattern: /\b(idiot|idi[o0]t|id[i1]ot)\b/i, category: "bullying", alertLevel: "level3", reason: "Insulting language" },
  { pattern: /\b(dumb(ass)?|dumbo|dumb[*@]ss)\b/i, category: "bullying", alertLevel: "level3", reason: "Insulting language" },
  { pattern: /\b(loser|l[o0]ser|luser)\b/i, category: "bullying", alertLevel: "level3", reason: "Insulting language" },
  { pattern: /\b(ugly|uggo|ugl[yie])\b/i, category: "bullying", alertLevel: "level3", reason: "Appearance-based insult" },
  { pattern: /\b(fat(so|ty|ass)?|chubby|obese|whale|pig)\b/i, category: "bullying", alertLevel: "level3", reason: "Body-shaming language" },
  { pattern: /\b(skinny|anorexic|skeleton|stick)\b/i, category: "bullying", alertLevel: "level3", reason: "Body-shaming language" },
  { pattern: /\b(freak|weirdo|creep(y)?|psycho|lunatic|crazy)\b/i, category: "bullying", alertLevel: "level3", reason: "Derogatory label" },
  { pattern: /\b(nerd|geek|dork|lame(o)?|square)\b/i, category: "bullying", alertLevel: "level3", reason: "Mocking label" },
  { pattern: /\b(trash|garbage|worthless|pathetic|useless|waste)\b/i, category: "bullying", alertLevel: "level3", reason: "Degrading language" },
  { pattern: /\b(nobody\s*(likes?|wants?|cares?\s*about)\s*(you|u))\b/i, category: "bullying", alertLevel: "level3", reason: "Social exclusion / bullying" },
  { pattern: /\b(you('?re|\s*are)\s*(so\s*)?(pathetic|worthless|useless|stupid|ugly|fat|annoying))\b/i, category: "bullying", alertLevel: "level3", reason: "Direct insult" },
  { pattern: /\b(go\s*(away|cry|home)|leave\s*(me|us)\s*alone|get\s*(lost|out))\b/i, category: "bullying", alertLevel: "level3", reason: "Exclusionary language" },
  { pattern: /\b(no\s*one\s*(asked|cares)|who\s*asked|didn'?t\s*ask)\b/i, category: "bullying", alertLevel: "level3", reason: "Dismissive / exclusionary" },
  { pattern: /\b(we\s*don'?t\s*want\s*(you|u)|you('?re|\s*are)\s*not\s*(invited|welcome))\b/i, category: "bullying", alertLevel: "level3", reason: "Social exclusion" },
  { pattern: /\b(cry\s*baby|crybaby|baby|grow\s*up)\b/i, category: "bullying", alertLevel: "level3", reason: "Mocking / belittling" },

  // === HATE / HOSTILITY ===
  { pattern: /\b(hate\s*(you|u|him|her|them)|i\s*hate)\b/i, category: "hostility", alertLevel: "level3", reason: "Expressions of hatred" },
  { pattern: /\b(shut\s*(the\s*)?(hell\s*)?up|sthu|stfu)\b/i, category: "hostility", alertLevel: "level3", reason: "Hostile language" },
  { pattern: /\b(suck(s|er)?|you\s*suck|that\s*sucks)\b/i, category: "hostility", alertLevel: "level3", reason: "Hostile/vulgar expression" },
  { pattern: /\b(screw\s*(you|u|off)|eff\s*(you|u|off)|f\s*(you|u|off))\b/i, category: "hostility", alertLevel: "level3", reason: "Hostile expression" },
  { pattern: /\b(i('?ll| will)\s*(ruin|destroy|expose)\s*(you|your))\b/i, category: "hostility", alertLevel: "level3", reason: "Threat / intimidation" },

  // === CYBERBULLYING TACTICS ===
  { pattern: /\b(i('?ll| will)\s*tell\s*everyone|everyone\s*(knows?|thinks?)\s*(you('?re|\s*are)))\b/i, category: "cyberbullying", alertLevel: "level3", reason: "Social manipulation / gossip threat" },
  { pattern: /\b(screenshot(ted|ting)?|i\s*(have\s*)?(screen\s*shot|ss)|posting\s*(this|it))\b/i, category: "cyberbullying", alertLevel: "level3", reason: "Screenshot/exposure threat" },
  { pattern: /\b(expose|exposing|leaked?|doxx?(ed|ing)?)\b/i, category: "cyberbullying", alertLevel: "level3", reason: "Exposure / doxxing threat" },
  { pattern: /\b(catfish(ing)?|fake\s*(account|profile))\b/i, category: "cyberbullying", alertLevel: "level3", reason: "Deception / catfishing" },
  { pattern: /\b(cancel(led|ling)?|get(ting)?\s*(you|him|her)\s*cancelled)\b/i, category: "cyberbullying", alertLevel: "level3", reason: "Cancel culture / social harm" },

  // === PEER PRESSURE ===
  { pattern: /\b((you('?re|\s*are)\s*)?(a\s*)?(chicken|coward|wimp|wuss|scaredy|scared))\b/i, category: "peer_pressure", alertLevel: "level3", reason: "Peer pressure / taunting" },
  { pattern: /\b(i\s*dare\s*(you|u)|i\s*bet\s*(you|u)\s*(won'?t|can'?t))\b/i, category: "peer_pressure", alertLevel: "level3", reason: "Dare / peer pressure" },
  { pattern: /\b(don'?t\s*be\s*(a\s*)?(baby|chicken|wimp|wuss|scared))\b/i, category: "peer_pressure", alertLevel: "level3", reason: "Peer pressure / coercion" },
  { pattern: /\b(everyone('?s|\s*is)\s*doing\s*it|you('?re|\s*are)\s*the\s*only\s*one\s*(who\s*)?(not|isn'?t))\b/i, category: "peer_pressure", alertLevel: "level3", reason: "Peer pressure" },

  // === MILD PROFANITY ===
  { pattern: /\b(hell|h[e3]ll)\b/i, category: "profanity_mild", alertLevel: "level3", reason: "Mild profanity" },
  { pattern: /\b(b[o0]{2}bs?|booty|butt\s*(cheek|crack|hole))\b/i, category: "profanity_mild", alertLevel: "level3", reason: "Crude body reference" },
];

const LEVEL2_ENTRIES: DictionaryEntry[] = [

  // === POTTY HUMOR / MILD CRUDE ===
  { pattern: /\b(crap(py)?|cr[a@]p)\b/i, category: "crude", alertLevel: "level2", reason: "Mild crude language" },
  { pattern: /\b(butt|booty|bum|behind|tush(y|ie)?)\b/i, category: "crude", alertLevel: "level2", reason: "Mild body reference" },
  { pattern: /\b(pee|poop(y)?|fart(ed|ing|s)?|gas(sy)?|burp(ed|ing|s)?)\b/i, category: "crude", alertLevel: "level2", reason: "Potty humor" },
  { pattern: /\b(booger(s)?|snot(ty)?|barf(ed|ing)?|puke(d|ing)?|vomit)\b/i, category: "crude", alertLevel: "level2", reason: "Gross-out humor" },
  { pattern: /\b(stink(y|s)?|smelly|gross|nasty|disgusting|eww+|ew+)\b/i, category: "crude", alertLevel: "level2", reason: "Mild crude expression" },

  // === MILD EXCLAMATIONS ===
  { pattern: /\b(heck|darn|dang|gosh|golly|frick|frig|freaking|friggin)\b/i, category: "mild_exclamation", alertLevel: "level2", reason: "Mild exclamation" },
  { pattern: /\b(jeez|geez|gee[zs]|omg|oh\s*my\s*(god|gosh|goodness))\b/i, category: "mild_exclamation", alertLevel: "level2", reason: "Mild exclamation" },
  { pattern: /\b(shoot|dagnabbit|crud|rats|shucks|dagnabit|dag)\b/i, category: "mild_exclamation", alertLevel: "level2", reason: "Mild exclamation" },
  { pattern: /\b(sux|suxx|suckish)\b/i, category: "crude", alertLevel: "level2", reason: "Mild crude expression" },

  // === MILD TEASING ===
  { pattern: /\b(noob|n[o0]{2}b|newb(ie)?|scrub)\b/i, category: "teasing", alertLevel: "level2", reason: "Mild teasing" },
  { pattern: /\b(tryhard|try[\s-]?hard|sweat(y)?)\b/i, category: "teasing", alertLevel: "level2", reason: "Mild teasing" },
  { pattern: /\b(sus|sussy|suss(ed)?)\b/i, category: "teasing", alertLevel: "level2", reason: "Slang teasing" },
  { pattern: /\b(mid|basic|cringe|cring[ey])\b/i, category: "teasing", alertLevel: "level2", reason: "Mild mocking" },
  { pattern: /\b(simp|simping|thirst(y)?)\b/i, category: "teasing", alertLevel: "level2", reason: "Mild social teasing" },
  { pattern: /\b(clown|clowning|joker)\b/i, category: "teasing", alertLevel: "level2", reason: "Mild mocking" },
  { pattern: /\b(cap|no\s*cap|capping|cappin)\b/i, category: "teasing", alertLevel: "level2", reason: "Slang: accusing of lying" },
];

const LEVEL1_ENTRIES: DictionaryEntry[] = [

  // === DISMISSIVE / SARCASTIC TONE ===
  { pattern: /\b(whatever|whatev|whatevs|whatevz)\b/i, category: "tone", alertLevel: "level1", reason: "Dismissive tone" },
  { pattern: /\b(idc|idk|idgaf|idek|idrk)\b/i, category: "tone", alertLevel: "level1", reason: "Dismissive abbreviation" },
  { pattern: /\b(bruh|bruv|bro\s*moment)\b/i, category: "tone", alertLevel: "level1", reason: "Casual/dismissive tone" },
  { pattern: /\b(ok\s*and|and\s*\?|so\s*\?|who\s*cares|big\s*deal)\b/i, category: "tone", alertLevel: "level1", reason: "Dismissive expression" },
  { pattern: /\b(bye\s*felicia|cool\s*story|ok\s*boomer)\b/i, category: "tone", alertLevel: "level1", reason: "Sarcastic/dismissive expression" },
  { pattern: /\b(slay|queen|periodt?|yass|skibidi|rizz|gyatt?)\b/i, category: "slang", alertLevel: "level1", reason: "Trending slang (monitored)" },
  { pattern: /\b(ratio|ratioed|l\s*\+\s*ratio)\b/i, category: "slang", alertLevel: "level1", reason: "Social media antagonism slang" },
  { pattern: /\b(cope|copium|seethe|mald(ing)?)\b/i, category: "slang", alertLevel: "level1", reason: "Dismissive internet slang" },
  { pattern: /\b(touch\s*grass|go\s*outside|get\s*a\s*life)\b/i, category: "tone", alertLevel: "level1", reason: "Dismissive suggestion" },
  { pattern: /\b(npc|main\s*character)\b/i, category: "slang", alertLevel: "level1", reason: "Dehumanizing internet slang" },
  { pattern: /\b(ick|giving\s*me\s*(the\s*)?ick)\b/i, category: "tone", alertLevel: "level1", reason: "Dismissive/judging tone" },
];

export const CONTENT_DICTIONARY: DictionaryEntry[] = [
  ...LEVEL5_ENTRIES,
  ...LEVEL4_ENTRIES,
  ...LEVEL3_ENTRIES,
  ...LEVEL2_ENTRIES,
  ...LEVEL1_ENTRIES,
];

export function getDictionaryByLevel(level: AlertLevel): DictionaryEntry[] {
  return CONTENT_DICTIONARY.filter(e => e.alertLevel === level);
}

export function getDictionaryStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const entry of CONTENT_DICTIONARY) {
    stats[entry.alertLevel] = (stats[entry.alertLevel] || 0) + 1;
    stats[`category:${entry.category}`] = (stats[`category:${entry.category}`] || 0) + 1;
  }
  stats.total = CONTENT_DICTIONARY.length;
  return stats;
}

export type { AlertLevel, DictionaryEntry };
