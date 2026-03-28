import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  usersTable, waitlistTable,
  contactsTable, conversationsTable, messagesTable, alertsTable,
  messageAnalyticsTable, conversationInsightsTable, keywordTrendsTable,
  behavioralMetricsTable, networkGraphTable, churnPredictionsTable,
  temporalAnomaliesTable, interestGraphTable, analyticsEventsTable,
  sessionTrackingTable, safetyAnalyticsTable, demographicSnapshotsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "../lib/require-admin";
import crypto from "crypto";

const router: IRouter = Router();
router.use("/admin/ops/seed-demo", requireAdmin);

const FIRST_NAMES_M = ["Liam","Noah","Oliver","James","Elijah","William","Henry","Lucas","Benjamin","Jack","Alexander","Daniel","Matthew","Sebastian","Joseph","Samuel","David","Carter","Wyatt","Jayden","Luke","Owen","Caleb","Isaac","Ryan","Nathan","Adrian","Eli","Nolan","Christian","Aaron","Ezra","Colton","Landon","Hunter","Jordan","Nicholas","Dominic","Austin","Mason","Logan","Aiden","Jackson","Dylan","Gavin","Miles","Parker","Asher","Brody","Camden","Chase","Cole","Connor","Cooper","Easton","Evan","Grant","Hudson","Ian","Jace","Jake","Jason","Jesse","Joshua","Justin","Kyle","Leo","Lincoln","Luca","Marcus","Max","Micah","Miles","Oscar","Peyton","Quinn","Reid","Rowan","Silas","Spencer","Tyler","Vincent","Wesley","Xander","Zachary"];
const FIRST_NAMES_F = ["Olivia","Emma","Ava","Sophia","Isabella","Mia","Charlotte","Amelia","Harper","Evelyn","Abigail","Emily","Ella","Elizabeth","Sofia","Avery","Scarlett","Grace","Chloe","Riley","Layla","Zoey","Lily","Hannah","Nora","Lillian","Addison","Eleanor","Natalie","Luna","Savannah","Brooklyn","Leah","Zoe","Stella","Hazel","Ellie","Paisley","Audrey","Aria","Aurora","Bella","Camila","Claire","Daisy","Eden","Eliana","Faith","Gabriella","Gianna","Hailey","Isabel","Ivy","Jade","Jasmine","Julia","Keira","Kennedy","Kinsley","Kylie","Leila","Lyla","Mackenzie","Madison","Maya","Mila","Naomi","Nevaeh","Paige","Penelope","Piper","Quinn","Reagan","Rose","Ruby","Sadie","Sara","Skyler","Valentina","Victoria","Violet","Willow"];
const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Anderson","Taylor","Thomas","Moore","Jackson","Martin","Lee","Thompson","White","Harris","Clark","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Hill","Green","Adams","Baker","Nelson","Carter","Mitchell","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards","Collins","Stewart","Sanchez","Morris","Rogers","Reed","Cook","Morgan","Bell","Murphy","Bailey","Rivera","Cooper","Richardson","Cox","Howard","Ward","Torres","Peterson","Gray","Ramirez","James","Watson","Brooks","Kelly","Sanders","Price","Bennett","Wood","Barnes","Ross","Henderson","Coleman","Jenkins","Perry","Powell","Long","Patterson","Hughes","Flores","Washington","Butler","Simmons","Foster","Gonzales","Bryant","Alexander","Russell","Griffin","Diaz","Hayes"];
const SCHOOL_NAMES = ["Cornerstone Academy","Riverside Christian School","Lighthouse Prep","Faith Community School","Heritage Academy","Trinity Classical","Maplewood Elementary","Oakhill Charter","Cedar Springs Academy","Valley Christian School","Summit Preparatory","Grace Lutheran School","New Hope Academy","Calvary Day School","Bethany Christian","Crossroads Academy","Mountain View School","Providence Classical","Harvest Community School","Shepherd's Gate Academy"];
const CHURCH_NAMES = ["Grace Community Church","First Baptist Church","Crossroads Fellowship","New Life Church","Hope Chapel","Redeemer Presbyterian","Christ the King","Living Water Church","Cornerstone Church","Faith Bible Church","Trinity United Methodist","Hillside Community Church","Resurrection Lutheran","Covenant Presbyterian","The Bridge Church","Northside Baptist","Journey Church","Anchor Church","Restoration Church","Mercy Hill Church"];

const TOPICS: ("social"|"emotional"|"academic"|"faith"|"conflict"|"humor"|"family"|"friendship"|"identity"|"health"|"media"|"creative"|"sports"|"technology"|"other")[] = ["social","emotional","academic","faith","conflict","humor","family","friendship","identity","health","media","creative","sports","technology","other"];
const SENTIMENTS: ("very_negative"|"negative"|"neutral"|"positive"|"very_positive")[] = ["very_negative","negative","neutral","positive","very_positive"];
const TONES: ("joy"|"sadness"|"anger"|"fear"|"surprise"|"trust"|"anticipation"|"curiosity"|"empathy"|"anxiety"|"pride"|"gratitude"|"loneliness"|"neutral")[] = ["joy","sadness","anger","fear","surprise","trust","anticipation","curiosity","empathy","anxiety","pride","gratitude","loneliness","neutral"];
const AVATAR_COLORS = ["#6B9E8A","#7B8EC4","#E8927C","#C47BA0","#8BC4A9","#D4A76A","#9B8EC4","#6BAEC4","#C4A07B","#8C9E6B"];
const GRADES = ["K","1st","2nd","3rd","4th","5th","6th","7th","8th"];
const ALERT_TITLES: Record<string, string[]> = {
  level1: ["Mild language detected","Slang usage flagged","Minor tone concern","Informal language pattern"],
  level2: ["Inappropriate language","Risky topic detected","Concerning word pattern","Age-inappropriate reference"],
  level3: ["Bullying language detected","Aggressive tone flagged","Unsafe content warning","Harassment pattern identified"],
  level4: ["Severe language detected","Threat language flagged","Emergency content","Explicit threat identified"],
  level5: ["Crisis language detected","Immediate danger signal","Self-harm indicator","Emergency intervention needed"],
};

const MESSAGES_POOL = [
  "Hey! Want to play after school?","Sure that sounds fun!","Did you finish the homework?",
  "lol that was so funny","I'm bored","What are you doing?","Can we hang out this weekend?",
  "My mom said I can go!","That's awesome!","I don't feel good today",
  "Are you going to the game?","Yes I'll be there!","Who else is coming?",
  "I love this song","Have you seen that movie?","It was really good",
  "I'm so excited for tomorrow!","Me too!","What time should I come over?",
  "I miss you!","Let's video chat later","Okay sounds good",
  "Do you like the new teacher?","She's nice","Math is so hard",
  "I got an A on my test!","Congratulations!","Thanks! I studied a lot",
  "My brother is so annoying","lol same","Siblings are the worst sometimes",
  "Want to join our group project?","Sure! What's it about?","We're doing it on space",
  "That's cool!","I love science","Me too it's my favorite subject",
  "Are you okay?","Yeah just tired","Get some rest!",
  "Happy birthday!","Thank you so much!","Did you get anything good?",
  "I got a new bike!","That's amazing!","We should ride together",
  "Church was great today","I liked the worship songs","The sermon was about kindness",
  "God is good","Amen to that","I've been praying about it",
  "Bible study was fun tonight","What chapter did you read?","We did Proverbs",
  "I'm feeling sad today","I'm sorry to hear that","Want to talk about it?",
  "Everything will be okay","Thanks for being such a good friend","Always here for you",
  "Practice was tough today","Keep going you're doing great!","Thanks coach was intense",
  "Did you see the sunset?","It was beautiful!","God's artwork",
  "I'm nervous about the test","You'll do great!","Just believe in yourself",
  "My family is going on vacation!","Where are you going?","To the beach!",
  "That sounds like so much fun","I wish I could come","Maybe next time!",
  "Can you help me with math?","Of course! Which problem?","Number 7 is really hard",
  "I made the soccer team!","That's incredible!","Thanks I worked really hard",
  "Youth group was amazing tonight","What did you guys do?","We played games and talked about faith",
  "I'm praying for your grandma","Thank you so much","She's getting better!",
  "Do you want to study together?","Yeah let's meet at the library","What time works for you?",
  "I drew a picture of us!","Aww that's so sweet!","You're a great artist",
  "Sorry I didn't text back sooner","No worries!","I was at dinner with my family",
  "Can't wait for summer!","Same! Any plans?","We're going camping!",
];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)]; }
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function uuid() { return crypto.randomUUID(); }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000); }
function recentDate(maxDaysBack: number) {
  const weight = Math.random() * Math.random();
  return daysAgo(Math.floor(weight * maxDaysBack));
}
function familyCode() { return `TETHER-${crypto.randomBytes(3).toString("hex").toUpperCase()}`; }
function ageGroup(age: number) {
  if (age <= 8) return "6-8";
  if (age <= 11) return "9-11";
  if (age <= 14) return "12-14";
  return "15+";
}

router.get("/admin/ops/seed-demo", async (_req, res) => {
  try {
    const result = await db.execute(sql`SELECT count(*)::int AS c FROM users WHERE email LIKE '%@demo.tether.app'`);
    const demoCount = (result.rows[0] as any).c;
    res.json({ isDemoLoaded: demoCount > 100, demoUserCount: demoCount });
  } catch (err: any) {
    res.json({ isDemoLoaded: false, demoUserCount: 0 });
  }
});

router.post("/admin/ops/seed-demo", async (_req, res) => {
  try {
    const existingCount = await db.select({ c: sql<number>`count(*)::int` }).from(usersTable);
    if (existingCount[0].c > 100) {
      return res.status(400).json({ error: "Database already has significant data. Clear demo data first before re-seeding." });
    }

    const NUM_PARENTS = 3200;
    const NUM_WAITLIST = 800;

    res.json({ status: "seeding", message: "Demo data seeding started. This runs in background — check the Demo Data page for progress." });

    (async () => {
      try {
        console.log("[Seed] Starting demo data generation...");
        const startTime = Date.now();

        const parentIds: number[] = [];
        const childIds: number[] = [];
        const childParentMap: Record<number, number> = {};
        const childAges: Record<number, number> = {};

        for (let batch = 0; batch < NUM_PARENTS; batch += 200) {
          const batchSize = Math.min(200, NUM_PARENTS - batch);
          const parentRows = [];
          for (let i = 0; i < batchSize; i++) {
            const fn = pick([...FIRST_NAMES_M, ...FIRST_NAMES_F]);
            const ln = pick(LAST_NAMES);
            parentRows.push({
              email: `${fn.toLowerCase()}.${ln.toLowerCase()}${rand(1,9999)}@demo.tether.app`,
              displayName: `${fn} ${ln}`,
              role: "parent" as const,
              avatarColor: pick(AVATAR_COLORS),
              familyCode: familyCode(),
              passwordHash: `demo_${uuid()}`,
              faithModeEnabled: Math.random() < 0.42,
              createdAt: recentDate(365),
            });
          }
          const inserted = await db.insert(usersTable).values(parentRows).returning({ id: usersTable.id });
          parentIds.push(...inserted.map(r => r.id));
        }
        console.log(`[Seed] Created ${parentIds.length} parents`);

        for (let batch = 0; batch < parentIds.length; batch += 200) {
          const batchSize = Math.min(200, parentIds.length - batch);
          const childRows: any[] = [];
          for (let i = 0; i < batchSize; i++) {
            const parentId = parentIds[batch + i];
            const numChildren = Math.random() < 0.3 ? 3 : Math.random() < 0.5 ? 2 : 1;
            for (let c = 0; c < numChildren; c++) {
              const age = rand(6, 16);
              const gradeIdx = Math.min(age - 5, GRADES.length - 1);
              const isFemale = Math.random() < 0.5;
              childRows.push({
                displayName: pick(isFemale ? FIRST_NAMES_F : FIRST_NAMES_M),
                role: "child" as const,
                parentId,
                age,
                grade: GRADES[Math.max(0, gradeIdx)],
                pin: `$2b$10$demo${uuid().slice(0,20)}`,
                avatarColor: pick(AVATAR_COLORS),
                trustLevel: rand(1, 5),
                faithModeEnabled: Math.random() < 0.38,
                isPaused: Math.random() < 0.05,
                screenTimeLimitMinutes: pick([0, 0, 30, 60, 120]),
                dailyMessageLimit: pick([0, 0, 0, 50, 100]),
                cooldownSeconds: pick([0, 0, 0, 10, 30]),
                createdAt: recentDate(300),
                _parentId: parentId,
                _age: age,
              });
            }
          }
          const cleanRows = childRows.map(({ _parentId, _age, ...r }) => r);
          const inserted = await db.insert(usersTable).values(cleanRows).returning({ id: usersTable.id });
          inserted.forEach((r, idx) => {
            childIds.push(r.id);
            childParentMap[r.id] = childRows[idx]._parentId;
            childAges[r.id] = childRows[idx]._age;
          });
        }
        console.log(`[Seed] Created ${childIds.length} children`);

        const contactIds: number[] = [];
        const contactPairs: [number, number][] = [];
        for (let batch = 0; batch < childIds.length; batch += 500) {
          const batchSize = Math.min(500, childIds.length - batch);
          const contactRows: any[] = [];
          for (let i = 0; i < batchSize; i++) {
            const childId = childIds[batch + i];
            const numContacts = rand(1, 5);
            for (let c = 0; c < numContacts; c++) {
              const contactChild = pick(childIds.filter(id => id !== childId && childParentMap[id] !== childParentMap[childId]));
              if (!contactChild) continue;
              contactRows.push({
                childId,
                contactChildId: contactChild,
                contactName: `Friend${rand(1,99999)}`,
                avatarColor: pick(AVATAR_COLORS),
                approvedByParent: Math.random() < 0.85,
                _contactChild: contactChild,
              });
            }
          }
          const cleanRows = contactRows.map(({ _contactChild, ...r }) => r);
          if (cleanRows.length > 0) {
            const inserted = await db.insert(contactsTable).values(cleanRows).returning({ id: contactsTable.id });
            inserted.forEach((r, idx) => {
              contactIds.push(r.id);
              contactPairs.push([contactRows[idx].childId, r.id]);
            });
          }
        }
        console.log(`[Seed] Created ${contactIds.length} contacts`);

        const convoIds: number[] = [];
        const convoChildMap: Record<number, number> = {};
        const approvedPairs = contactPairs.slice(0, Math.floor(contactPairs.length * 0.85));
        for (let batch = 0; batch < approvedPairs.length; batch += 500) {
          const batchSize = Math.min(500, approvedPairs.length - batch);
          const convoRows: any[] = [];
          for (let i = 0; i < batchSize; i++) {
            const [childId, contactId] = approvedPairs[batch + i];
            convoRows.push({
              childId,
              contactId,
              lastMessagePreview: pick(MESSAGES_POOL),
              lastMessageAt: recentDate(14),
              unreadCount: rand(0, 5),
              _childId: childId,
            });
          }
          const cleanRows = convoRows.map(({ _childId, ...r }) => r);
          const inserted = await db.insert(conversationsTable).values(cleanRows).returning({ id: conversationsTable.id });
          inserted.forEach((r, idx) => {
            convoIds.push(r.id);
            convoChildMap[r.id] = convoRows[idx]._childId;
          });
        }
        console.log(`[Seed] Created ${convoIds.length} conversations`);

        let totalMessages = 0;
        const messageInsertedIds: { id: number; convoId: number; senderId: number; createdAt: Date }[] = [];
        for (let batch = 0; batch < convoIds.length; batch += 300) {
          const batchSize = Math.min(300, convoIds.length - batch);
          const msgRows: any[] = [];
          for (let i = 0; i < batchSize; i++) {
            const convoId = convoIds[batch + i];
            const childId = convoChildMap[convoId];
            const numMsgs = rand(3, 25);
            for (let m = 0; m < numMsgs; m++) {
              const alertRoll = Math.random();
              let alertLevel: "none"|"level1"|"level2"|"level3"|"level4"|"level5" = "none";
              if (alertRoll > 0.97) alertLevel = "level4";
              else if (alertRoll > 0.94) alertLevel = "level3";
              else if (alertRoll > 0.88) alertLevel = "level2";
              else if (alertRoll > 0.78) alertLevel = "level1";

              const createdAt = recentDate(28);
              msgRows.push({
                conversationId: convoId,
                senderId: childId,
                content: pick(MESSAGES_POOL),
                alertLevel,
                isBlocked: alertLevel === "level4" || alertLevel === "level5" ? Math.random() < 0.6 : false,
                isDelivered: true,
                createdAt,
                _convoId: convoId,
              });
            }
          }
          const cleanRows = msgRows.map(({ _convoId, ...r }) => r);
          const inserted = await db.insert(messagesTable).values(cleanRows).returning({ id: messagesTable.id, conversationId: messagesTable.conversationId, senderId: messagesTable.senderId, createdAt: messagesTable.createdAt });
          inserted.forEach((r, idx) => {
            messageInsertedIds.push({ id: r.id, convoId: r.conversationId, senderId: r.senderId, createdAt: r.createdAt });
          });
          totalMessages += inserted.length;
        }
        console.log(`[Seed] Created ${totalMessages} messages`);

        const alertRows = [];
        for (const msg of messageInsertedIds) {
          if (Math.random() > 0.15) continue;
          const level = pick(["level1","level2","level3","level4","level5"] as const);
          const childId = convoChildMap[msg.convoId];
          if (!childId) continue;
          const parentId = childParentMap[childId];
          if (!parentId) continue;
          alertRows.push({
            parentId,
            childId,
            messageId: msg.id,
            alertLevel: level,
            title: pick(ALERT_TITLES[level] || ["Alert"]),
            description: `Flagged content in conversation — automated safety review`,
            isRead: Math.random() < 0.6,
            createdAt: msg.createdAt,
          });
        }
        for (let b = 0; b < alertRows.length; b += 500) {
          await db.insert(alertsTable).values(alertRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${alertRows.length} alerts`);

        const analyticsRows = [];
        const analyticsBatchSize = Math.min(50000, messageInsertedIds.length);
        for (let i = 0; i < analyticsBatchSize; i++) {
          const msg = messageInsertedIds[i];
          const childId = convoChildMap[msg.convoId];
          const age = childAges[childId] || 10;
          const sentScore = (Math.random() * 2 - 0.5);
          const sentIdx = sentScore < -0.4 ? 0 : sentScore < -0.1 ? 1 : sentScore < 0.3 ? 2 : sentScore < 0.6 ? 3 : 4;
          analyticsRows.push({
            messageId: msg.id,
            conversationId: msg.convoId,
            senderId: msg.senderId,
            senderAgeGroup: ageGroup(age),
            wordCount: rand(2, 30),
            sentenceCount: rand(1, 4),
            avgWordLength: 3 + Math.random() * 3,
            vocabularyComplexity: Math.random() * 0.8 + 0.1,
            sentimentScore: sentScore,
            sentimentLabel: SENTIMENTS[sentIdx],
            emotionalTone: pick(TONES),
            topicCategory: pick(TOPICS),
            topicKeywords: pickN(["school","friend","game","fun","help","church","pray","love","family","sport","music","art","test","homework","movie","bible","prayer","worship","kindness","team"], 3),
            hasEmoji: Math.random() < 0.35,
            hasSlang: Math.random() < 0.25,
            emojiToTextRatio: Math.random() * 0.3,
            messageLength: rand(5, 200),
            interestNouns: pickN(["school","game","church","friend","family","sport","music","art","movie","book","dog","cat","bike","park","beach"], 3),
            interestVerbs: pickN(["play","talk","study","pray","run","watch","draw","sing","read","help"], 2),
            interactionDepth: rand(1, 8),
            responseTimeSeconds: rand(10, 7200),
            isConversationStarter: Math.random() < 0.15,
            createdAt: msg.createdAt,
          });
        }
        for (let b = 0; b < analyticsRows.length; b += 500) {
          await db.insert(messageAnalyticsTable).values(analyticsRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${analyticsRows.length} message analytics`);

        const sampledChildren = pickN(childIds, Math.min(2000, childIds.length));
        const ageGroups = ["6-8","9-11","12-14","15+"];

        try {
        const behavioralRows = [];
        for (const childId of sampledChildren) {
          for (let d = 0; d < 28; d += 7) {
            const periodDate = daysAgo(d);
            periodDate.setHours(0, 0, 0, 0);
            behavioralRows.push({
              userId: childId,
              periodDate,
              sentimentVolatility: Math.random() * 0.8,
              sentimentMean: Math.random() * 1.5 - 0.3,
              sentimentMin: -1 + Math.random() * 0.5,
              sentimentMax: 0.5 + Math.random() * 0.5,
              avgResponseLatencySeconds: rand(30, 3600),
              responseLatencyStddev: rand(10, 500),
              emojiToTextRatio: Math.random() * 0.4,
              emojiToTextRatioTrend: (Math.random() - 0.5) * 0.1,
              avgMessageLength: rand(10, 150),
              messageLengthTrend: (Math.random() - 0.5) * 5,
              cognitiveFatigueScore: Math.random() * 0.7,
              messagesAnalyzed: rand(5, 100),
              anxietyIndicatorScore: Math.random() * 0.6,
              socialAvoidanceScore: Math.random() * 0.5,
            });
          }
        }
        for (let b = 0; b < behavioralRows.length; b += 500) {
          await db.insert(behavioralMetricsTable).values(behavioralRows.slice(b, b + 500)).onConflictDoNothing();
        }
        console.log(`[Seed] Created ${behavioralRows.length} behavioral metrics`);
        } catch (e) { console.error("[Seed] behavioral_metrics error:", e); }

        try {
        const networkRows = [];
        const roles = ["hub","bridge","peripheral","isolate","amplifier","leader","initiator","influencer","connector","observer"];
        const clusters = ["social-butterflies","academic-focused","sports-enthusiasts","faith-community","creative-minds","gaming-group","music-lovers","outdoor-explorers"];
        for (const childId of sampledChildren) {
          networkRows.push({
            userId: childId,
            periodDate: daysAgo(rand(0, 7)),
            influenceScore: Math.random(),
            replyTriggerRate: Math.random(),
            downstreamActions: rand(0, 50),
            uniqueConnections: rand(1, 15),
            messagesSent: rand(5, 200),
            messagesReceived: rand(5, 200),
            initiationRate: Math.random(),
            reciprocityScore: Math.random(),
            networkRole: pick(roles),
            clusterMembership: pick(clusters),
          });
        }
        for (let b = 0; b < networkRows.length; b += 500) {
          await db.insert(networkGraphTable).values(networkRows.slice(b, b + 500)).onConflictDoNothing();
        }
        console.log(`[Seed] Created ${networkRows.length} network graph entries`);
        } catch (e) { console.error("[Seed] network_graph error:", e); }

        try {
        const churnRows = [];
        for (const childId of pickN(childIds, Math.min(1500, childIds.length))) {
          const risk = Math.random();
          churnRows.push({
            userId: childId,
            churnRiskScore: risk,
            predictedChurnDate: risk > 0.6 ? daysAgo(-rand(7, 60)) : null,
            confidenceLevel: 0.5 + Math.random() * 0.5,
            silenceGradient: (Math.random() - 0.5) * 2,
            messageLengthGradient: (Math.random() - 0.5) * 2,
            responseTimeGradient: (Math.random() - 0.5) * 2,
            sessionFrequencyGradient: (Math.random() - 0.5) * 2,
            daysInactive: risk > 0.6 ? rand(7, 45) : rand(0, 5),
            lastActiveAt: daysAgo(risk > 0.6 ? rand(7, 45) : rand(0, 3)),
            riskFactors: risk > 0.6 ? pickN(["declining_messages","increasing_silence","shorter_sessions","fewer_contacts","negative_sentiment","extending_silence","shrinking_message_length","dropping_response_rate"], rand(2,4)) : [],
          });
        }
        for (let b = 0; b < churnRows.length; b += 500) {
          await db.insert(churnPredictionsTable).values(churnRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${churnRows.length} churn predictions`);
        } catch (e) { console.error("[Seed] churn_predictions error:", e); }

        try {
        const anomalyRows = [];
        for (let i = 0; i < 30; i++) {
          anomalyRows.push({
            anomalyType: pick(["volume_spike","sentiment_shift","new_topic_emergence","unusual_activity_time","connection_surge","vocabulary_change","emoji_surge"]),
            severity: Math.random(),
            metricName: pick(["message_volume","avg_sentiment","new_connections","login_frequency","alert_rate","response_time","vocabulary_complexity"]),
            baselineValue: rand(10, 100),
            observedValue: rand(50, 300),
            percentChange: rand(20, 200),
            timeWindowMinutes: pick([60, 360, 1440]),
            affectedUsers: rand(5, 500),
            resolved: Math.random() < 0.6,
            detectedAt: recentDate(60),
          });
        }
        await db.insert(temporalAnomaliesTable).values(anomalyRows);
        console.log(`[Seed] Created ${anomalyRows.length} anomalies`);
        } catch (e) { console.error("[Seed] anomalies error:", e); }

        try {
        const interestRows = [];
        const interestClusters = ["gaming","music","sports","faith","academics","social-media","art","animals","cooking","nature","science","reading"];
        for (const ag of ageGroups) {
          for (const cluster of pickN(interestClusters, 8)) {
            for (let w = 0; w < 12; w++) {
              interestRows.push({
                ageGroup: ag,
                periodDate: daysAgo(w * 7),
                interestCluster: cluster,
                nouns: pickN(["game","ball","book","friend","song","church","prayer","test","movie","phone","bike","dog","cat","park","team"], 4),
                verbs: pickN(["play","sing","read","pray","run","study","watch","draw","cook","explore","talk","help"], 3),
                occurrenceCount: rand(10, 500),
                sentimentAffinity: Math.random() * 1.5 - 0.3,
              });
            }
          }
        }
        for (let b = 0; b < interestRows.length; b += 500) {
          await db.insert(interestGraphTable).values(interestRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${interestRows.length} interest graph entries`);
        } catch (e) { console.error("[Seed] interest_graph error:", e); }

        try {
        const kwRows = [];
        const keywords = ["friend","school","game","church","pray","love","help","fun","happy","sad","scared","bored","excited","test","homework","movie","music","sport","art","family","God","Jesus","Bible","worship","kindness","bullying","angry","sorry","thanks","please","team","practice","birthday","summer","camping","beach"];
        for (const kw of keywords) {
          for (const ag of ageGroups) {
            kwRows.push({
              keyword: kw,
              category: pick(TOPICS),
              occurrenceCount: rand(5, 800),
              ageGroup: ag,
              periodStart: daysAgo(30),
              periodEnd: daysAgo(0),
            });
          }
        }
        await db.insert(keywordTrendsTable).values(kwRows);
        console.log(`[Seed] Created ${kwRows.length} keyword trends`);
        } catch (e) { console.error("[Seed] keyword_trends error:", e); }

        try {
        const convoInsightRows = [];
        for (const convoId of convoIds.slice(0, 3000)) {
          convoInsightRows.push({
            conversationId: convoId,
            analyzedAt: recentDate(7),
            totalMessages: rand(3, 40),
            avgSentimentScore: Math.random() * 1.6 - 0.3,
            sentimentTrend: pick(["improving","stable","declining","volatile"]),
            dominantTopic: pick(TOPICS),
            topicDistribution: Object.fromEntries(pickN(TOPICS, 4).map(t => [t, rand(5, 50)])),
            avgResponseTimeSeconds: rand(30, 3600),
            avgWordCount: rand(5, 30),
            vocabularyDiversity: Math.random() * 0.8 + 0.1,
            emotionalRange: Object.fromEntries(pickN(TONES, 4).map(t => [t, rand(1, 20)])),
            communicationBalance: Math.random(),
            conversationDepth: Math.random() * 8 + 1,
            healthScore: Math.random() * 0.6 + 0.3,
          });
        }
        for (let b = 0; b < convoInsightRows.length; b += 500) {
          await db.insert(conversationInsightsTable).values(convoInsightRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${convoInsightRows.length} conversation insights`);
        } catch (e) { console.error("[Seed] conversation_insights error:", e); }

        try {
        const safetyRows = [];
        for (let w = 0; w < 12; w++) {
          const pStart = daysAgo((w + 1) * 7);
          const pEnd = daysAgo(w * 7);
          const total = rand(5000, 15000);
          safetyRows.push({
            periodStart: pStart,
            periodEnd: pEnd,
            totalMessages: total,
            totalFlagged: rand(100, 800),
            level1Count: rand(50, 300),
            level2Count: rand(30, 150),
            level3Count: rand(10, 60),
            level4Count: rand(2, 20),
            level5Count: rand(0, 5),
            blockedCount: rand(5, 40),
            avgResponseTimeMinutes: rand(1, 30),
            falsePositiveRate: Math.random() * 0.2,
            topFlagCategories: pickN(["profanity","bullying","personal_info","inappropriate_content","violence","self_harm"], 3).map(c => ({ category: c, count: rand(5, 80) })),
            faithModeFlags: rand(2, 30),
            ageGroupBreakdown: { "6-8": rand(10, 50), "9-11": rand(20, 100), "12-14": rand(30, 200), "15+": rand(15, 80) },
          });
        }
        await db.insert(safetyAnalyticsTable).values(safetyRows);
        console.log(`[Seed] Created ${safetyRows.length} safety analytics periods`);
        } catch (e) { console.error("[Seed] safety_analytics error:", e); }

        try {
        const demoSnapshots = [];
        for (let w = 0; w < 12; w++) {
          const totalC = childIds.length - w * rand(50, 200);
          const totalP = parentIds.length - w * rand(20, 80);
          demoSnapshots.push({
            snapshotDate: daysAgo(w * 7),
            totalFamilies: totalP,
            totalParents: totalP,
            totalChildren: Math.max(totalC, 1000),
            ageDistribution: { "6-8": rand(1000, 2000), "9-11": rand(1500, 2500), "12-14": rand(1500, 2500), "15+": rand(500, 1500) },
            gradeDistribution: Object.fromEntries(GRADES.map(g => [g, rand(200, 1000)])),
            faithModeAdoption: 0.35 + Math.random() * 0.15,
            avgChildrenPerFamily: 2.1 + Math.random() * 0.6,
            trustLevelDistribution: { "1": rand(500, 1500), "2": rand(800, 2000), "3": rand(1000, 2500), "4": rand(600, 1500), "5": rand(200, 800) },
            activeUsersLast7d: rand(3000, 6000),
            activeUsersLast30d: rand(6000, 9000),
            newSignupsLast7d: rand(50, 300),
            retentionRate7d: 0.7 + Math.random() * 0.2,
            retentionRate30d: 0.5 + Math.random() * 0.3,
          });
        }
        await db.insert(demographicSnapshotsTable).values(demoSnapshots);
        console.log(`[Seed] Created ${demoSnapshots.length} demographic snapshots`);
        } catch (e) { console.error("[Seed] demographic_snapshots error:", e); }

        try {
        const eventRows = [];
        const webPages = ["/","/how-it-works","/pricing","/about","/faith-mode","/for-schools","/for-churches","/waitlist","/blog","/terms","/privacy"];
        const referrers = ["google.com","facebook.com","instagram.com","twitter.com","direct","tiktok.com","youtube.com","reddit.com"];
        for (let i = 0; i < 5000; i++) {
          const isWeb = Math.random() < 0.6;
          eventRows.push({
            source: isWeb ? "web" as const : "app" as const,
            eventName: isWeb ? pick(["page_view","waitlist_signup","scroll_depth","cta_click"]) : pick(["screen_view","message_sent","contact_approved","settings_changed","login"]),
            sessionId: uuid(),
            pageUrl: isWeb ? pick(webPages) : undefined,
            referrer: isWeb ? pick(referrers) : undefined,
            createdAt: recentDate(90),
          });
        }
        for (let b = 0; b < eventRows.length; b += 500) {
          await db.insert(analyticsEventsTable).values(eventRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${eventRows.length} analytics events`);
        } catch (e) { console.error("[Seed] analytics_events error:", e); }

        try {
        const sessionRows = [];
        for (let i = 0; i < 3000; i++) {
          const isWeb = Math.random() < 0.5;
          const dur = rand(30, 1800);
          const startedAt = recentDate(90);
          sessionRows.push({
            sessionId: uuid(),
            source: isWeb ? "web" as const : "app" as const,
            startedAt,
            endedAt: new Date(startedAt.getTime() + dur * 1000),
            durationSeconds: dur,
            pagesViewed: rand(1, 12),
            eventsCount: rand(1, 30),
            deviceType: pick(["mobile","desktop","tablet"]),
            platform: isWeb ? pick(["Chrome","Safari","Firefox","Edge"]) : pick(["iOS","Android"]),
          });
        }
        for (let b = 0; b < sessionRows.length; b += 500) {
          await db.insert(sessionTrackingTable).values(sessionRows.slice(b, b + 500));
        }
        console.log(`[Seed] Created ${sessionRows.length} sessions`);
        } catch (e) { console.error("[Seed] sessions error:", e); }

        try {
        const waitlistRows = [];
        for (let i = 0; i < NUM_WAITLIST; i++) {
          const fn = pick([...FIRST_NAMES_M, ...FIRST_NAMES_F]);
          const ln = pick(LAST_NAMES);
          const role = Math.random() < 0.6 ? "parent" : Math.random() < 0.5 ? "school" : "church";
          waitlistRows.push({
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${rand(1,9999)}@example.com`,
            name: role === "parent" ? `${fn} ${ln}` : role === "school" ? pick(SCHOOL_NAMES) : pick(CHURCH_NAMES),
            role: role as "parent"|"school"|"church",
            createdAt: recentDate(180),
          });
        }
        for (let b = 0; b < waitlistRows.length; b += 200) {
          await db.insert(waitlistTable).values(waitlistRows.slice(b, b + 200));
        }
        console.log(`[Seed] Created ${waitlistRows.length} waitlist entries`);
        } catch (e) { console.error("[Seed] waitlist error:", e); }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[Seed] DONE — demo data fully loaded in ${elapsed}s!`);
      } catch (err) {
        console.error("[Seed] Error during seeding:", err);
      }
    })();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admin/ops/seed-demo", async (_req, res) => {
  try {
    const demoChildIds = sql`(SELECT id FROM users WHERE parent_id IN (SELECT id FROM users WHERE email LIKE '%@demo.tether.app'))`;
    const demoParentIds = sql`(SELECT id FROM users WHERE email LIKE '%@demo.tether.app')`;
    const demoAllIds = sql`(SELECT id FROM users WHERE email LIKE '%@demo.tether.app' OR parent_id IN (SELECT id FROM users WHERE email LIKE '%@demo.tether.app'))`;

    await db.execute(sql`DELETE FROM churn_predictions WHERE user_id IN ${demoAllIds}`);
    await db.execute(sql`DELETE FROM network_graph WHERE user_id IN ${demoAllIds}`);
    await db.execute(sql`DELETE FROM behavioral_metrics WHERE user_id IN ${demoAllIds}`);
    await db.execute(sql`DELETE FROM interest_graph`);
    await db.execute(sql`DELETE FROM temporal_anomalies`);
    await db.execute(sql`DELETE FROM keyword_trends`);
    await db.execute(sql`DELETE FROM conversation_insights`);
    await db.execute(sql`DELETE FROM safety_analytics`);
    await db.execute(sql`DELETE FROM demographic_snapshots`);

    await db.execute(sql`DELETE FROM message_analytics WHERE conversation_id IN (SELECT id FROM conversations WHERE child_id IN ${demoChildIds})`);
    await db.execute(sql`DELETE FROM analytics_events`);
    await db.execute(sql`DELETE FROM session_tracking`);

    await db.execute(sql`DELETE FROM alerts WHERE parent_id IN ${demoParentIds}`);
    await db.execute(sql`DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE child_id IN ${demoChildIds})`);
    await db.execute(sql`DELETE FROM conversations WHERE child_id IN ${demoChildIds}`);
    await db.execute(sql`DELETE FROM contacts WHERE child_id IN ${demoChildIds}`);

    await db.execute(sql`DELETE FROM waitlist WHERE email LIKE '%@example.com'`);
    await db.execute(sql`DELETE FROM users WHERE parent_id IN ${demoParentIds}`);
    await db.execute(sql`DELETE FROM users WHERE email LIKE '%@demo.tether.app'`);

    res.json({ ok: true, message: "Demo data cleared successfully" });
  } catch (err: any) {
    console.error("Clear demo data error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
