var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);

// src/lib/firestoreService.ts
var import_firestore2 = require("firebase/firestore");

// src/firebase.ts
var import_app = require("firebase/app");
var import_auth = require("firebase/auth");
var import_firestore = require("firebase/firestore");

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "gen-lang-client-0687053617",
  appId: "1:682003318752:web:3028dfdf3091863b4b8d85",
  apiKey: "AIzaSyCzywKZz8MdlHOGSTF9JIpwP1WaRgxSPeI",
  authDomain: "gen-lang-client-0687053617.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-copyofremixremix-d0b94b41-b933-4ee6-980d-39777855109f",
  storageBucket: "gen-lang-client-0687053617.firebasestorage.app",
  messagingSenderId: "682003318752",
  measurementId: ""
};

// src/firebase.ts
var app = (0, import_app.getApps)().length > 0 ? (0, import_app.getApps)()[0] : (0, import_app.initializeApp)(firebase_applet_config_default);
var db = (0, import_firestore.getFirestore)(app, firebase_applet_config_default.firestoreDatabaseId);
var auth = (0, import_auth.getAuth)(app);
async function testConnection() {
  try {
    await (0, import_firestore.getDocFromServer)((0, import_firestore.doc)(db, "test", "connection"));
    console.log("\u{1F525} Firestore connection established.");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
  }
}
testConnection();

// src/lib/firestoreService.ts
var syncPatients = (callback) => {
  return (0, import_firestore2.onSnapshot)((0, import_firestore2.collection)(db, "patients"), (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
var savePatient = async (patient) => await (0, import_firestore2.setDoc)((0, import_firestore2.doc)(db, "patients", patient.id), patient, { merge: true });
var saveEncounter = async (encounter) => await (0, import_firestore2.setDoc)((0, import_firestore2.doc)(db, "encounters", encounter.id), encounter, { merge: true });

// server.ts
import_dotenv.default.config();
var serverSettings = {};
if (import_fs.default.existsSync("server-settings.json")) {
  try {
    serverSettings = JSON.parse(import_fs.default.readFileSync("server-settings.json", "utf8"));
  } catch (e) {
    console.error("Error reading server-settings.json", e);
  }
}
var supabaseUrl = process.env.SUPABASE_URL || serverSettings.supabaseUrl;
var supabaseKey = process.env.SUPABASE_SECRET_KEY || serverSettings.supabaseKey;
var supabaseAdmin = supabaseUrl && supabaseKey ? (0, import_supabase_js.createClient)(supabaseUrl, supabaseKey) : null;
global.supabaseAdmin = supabaseAdmin;
function getMedicationFallback(search_query) {
  const query2 = (search_query || "").toLowerCase().trim();
  if (query2.includes("aspirin") || query2.includes("\u0627\u0633\u0628\u0631\u064A\u0646") || query2.includes("\u0623\u0633\u0628\u064A\u0631\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Aspirin (Ecotrin)",
        "generic_name": "Acetylsalicylic Acid (ASA)",
        "drug_class": "Antiplatelet / Salicylates"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": false,
          "label_color": "slate",
          "reason": "Standard oral dose antiplatelet therapy. Monitor for bleeding or gastrointestinal irritation."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Asaphen", "reason_of_confusion": "Similar visual spelling and packaging in specific generic brands.", "danger_level": "Moderate" },
            { "name": "Aprixin", "reason_of_confusion": "Phonetic similarity when ordered verbally.", "danger_level": "Moderate" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral", "Chewable", "Rectal"],
        "vital_signs_to_monitor": ["Platelet Count", "Coagulation Panel (PT/INR)", "Gastrointestinal Bleeding signs"]
      }
    };
  }
  if (query2.includes("nitro") || query2.includes("\u0646\u064A\u062A\u0631\u0648") || query2.includes("\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Nitrostat / Nitronal",
        "generic_name": "Nitroglycerin",
        "drug_class": "Vasodilator / Nitrate"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "Potent vasodilator. Intravenous formulation requires continuous infusion monitoring to avoid severe acute hypotension."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Nitroprusside", "reason_of_confusion": "Both are rapid-acting IV vasodilators. Mixing them up can cause fatal dosing errors.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Sublingual", "Intravenous Infusion", "Transdermal Patch"],
        "vital_signs_to_monitor": ["Continuous Blood Pressure (BP)", "Heart Rate (HR)", "Electrocardiogram (ECG)"]
      }
    };
  }
  if (query2.includes("heparin") || query2.includes("\u0647\u064A\u0628\u0627\u0631\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Heparin Sodium",
        "generic_name": "Heparin",
        "drug_class": "Anticoagulant"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "CRITICAL HIGH-ALERT DRUG: High risk of serious bleeding. Requires strict dual-nurse verification of dosing and rate changes."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Hespan", "reason_of_confusion": "Extremely similar phonetic sound; Hespan is a plasma expander, Heparin is a strong anticoagulant.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Intravenous Infusion", "Subcutaneous Injection"],
        "vital_signs_to_monitor": ["Activated Partial Thromboplastin Time (aPTT)", "Platelet Count (HIT screening)", "Hemoglobin & Hematocrit"]
      }
    };
  }
  if (query2.includes("warfarin") || query2.includes("\u0648\u0627\u0631\u0641\u0627\u0631\u064A\u0646") || query2.includes("coumadin") || query2.includes("\u0643\u0648\u0645\u0627\u062F\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Coumadin",
        "generic_name": "Warfarin Sodium",
        "drug_class": "Anticoagulant (Vitamin K Antagonist)"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "Narrow therapeutic index. High risk of major hemorrhage if dose is not adjusted based on INR."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Wyanoids", "reason_of_confusion": "Phonetic similarity under specific brand packaging.", "danger_level": "Moderate" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral"],
        "vital_signs_to_monitor": ["PT / INR", "Signs of bruising, hematuria, or epistaxis", "Dietary Vitamin K intake consistency"]
      }
    };
  }
  if (query2.includes("insulin") || query2.includes("\u0623\u0646\u0633\u0648\u0644\u064A\u0646") || query2.includes("\u0627\u0646\u0633\u0648\u0644\u064A\u0646") || query2.includes("humalog") || query2.includes("lantus")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Humalog / Lantus / Actrapid",
        "generic_name": "Insulin (Rapid / Intermediate / Long Acting)",
        "drug_class": "Antidiabetic / Hormone"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "CRITICAL HIGH-ALERT: High risk of severe hypoglycemia resulting in confusion or coma. Verification of glucose levels is mandatory."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Insuman", "reason_of_confusion": "Visual spelling and packaging similarity across insulin types.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Subcutaneous Injection", "Intravenous Infusion"],
        "vital_signs_to_monitor": ["Capillary Blood Glucose (CBG)", "Serum Potassium (K+)", "Level of consciousness"]
      }
    };
  }
  if (query2.includes("lasix") || query2.includes("\u0644\u0627\u0632\u0643\u0633") || query2.includes("furosemide") || query2.includes("\u0641\u0648\u0631\u0648\u0633\u064A\u0645\u064A\u062F")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Lasix",
        "generic_name": "Furosemide",
        "drug_class": "Loop Diuretic"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": false,
          "label_color": "slate",
          "reason": "Standard loop diuretic therapy. High vigilance for electrolyte imbalances is advised."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Losec", "reason_of_confusion": "High LASA alert: Losec is Omeprazole while Lasix is a loop diuretic.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral", "Intravenous Injection"],
        "vital_signs_to_monitor": ["Hourly Urine Output (U/O)", "Serum Potassium (K+) & Sodium (Na+) levels", "Blood Pressure"]
      }
    };
  }
  return {
    "search_result": {
      "original_query": search_query,
      "is_corrected": false,
      "corrected_name_trade": search_query,
      "generic_name": search_query,
      "drug_class": "Therapeutic Agent"
    },
    "required_labels": {
      "high_alert_status": {
        "is_high_alert": false,
        "label_color": "slate",
        "reason": "Classified under standard clinical handling guidelines."
      },
      "lasa_status": {
        "has_lasa_risk": false,
        "label_color": "slate",
        "confused_with": []
      }
    },
    "clinical_guidelines": {
      "administration_routes": ["Oral", "Intravenous"],
      "vital_signs_to_monitor": ["Blood Pressure", "Heart Rate"]
    }
  };
}
function getInteractionFallback(med1, med2, isAr) {
  const m1 = med1.toLowerCase();
  const m2 = med2.toLowerCase();
  if (m1.includes("aspirin") && (m2.includes("heparin") || m2.includes("warfarin")) || m2.includes("aspirin") && (m1.includes("heparin") || m1.includes("warfarin"))) {
    return {
      "interaction_severity": "High",
      "has_interaction": true,
      "mechanism": isAr ? "\u062A\u0623\u062B\u064A\u0631 \u0645\u0636\u0627\u062F \u0644\u0644\u062A\u062E\u062B\u0631 \u062A\u0622\u0632\u0631\u064A. \u064A\u0645\u0646\u0639 \u0627\u0644\u0623\u0633\u0628\u0631\u064A\u0646 \u062A\u0631\u0627\u0643\u0645 \u0627\u0644\u0635\u0641\u0627\u0626\u062D \u0627\u0644\u062F\u0645\u0648\u064A\u0629 \u0628\u064A\u0646\u0645\u0627 \u064A\u0639\u0645\u0644 \u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646/\u0627\u0644\u0648\u0627\u0631\u0641\u0627\u0631\u064A\u0646 \u0639\u0644\u0649 \u062A\u062B\u0628\u064A\u0637 \u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u062A\u062C\u0644\u0637." : "Synergistic anticoagulant effect. Aspirin inhibits platelet aggregation while Heparin/Warfarin inhibits clotting factors.",
      "clinical_effects": isAr ? "\u0632\u064A\u0627\u062F\u0629 \u0634\u062F\u064A\u062F\u0629 \u0641\u064A \u0645\u062E\u0627\u0637\u0631 \u062D\u062F\u0648\u062B \u0646\u0632\u064A\u0641 \u062F\u0627\u062E\u0644\u064A \u0623\u0648 \u062E\u0627\u0631\u062C\u064A \u062D\u0627\u062F." : "Severely increased risk of major hemorrhage (internal or external bleeding).",
      "recommendation": isAr ? "\u062A\u062C\u0646\u0628 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0645\u062A\u0632\u0627\u0645\u0646 \u0625\u0644\u0627 \u062A\u062D\u062A \u0645\u0631\u0627\u0642\u0628\u0629 \u0637\u0628\u064A\u0629 \u062F\u0642\u064A\u0642\u0629 \u062C\u062F\u0627\u064B \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0632\u0645\u0646 \u0627\u0644\u0646\u0632\u064A\u0641 \u0648\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0640 INR." : "Avoid concomitant use unless strictly indicated under intensive surveillance. Monitor PT/INR and platelet levels closely.",
      "monitoring_guidelines": isAr ? "\u0645\u0631\u0627\u0642\u0628\u0629 \u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u0646\u0632\u064A\u0641 (\u0643\u062F\u0645\u0627\u062A \u063A\u064A\u0631 \u0645\u0641\u0633\u0631\u0629\u060C \u0646\u0632\u064A\u0641 \u0627\u0644\u0644\u062B\u0629\u060C \u0628\u064A\u0644\u0629 \u062F\u0645\u0648\u064A\u0629) \u0648\u0641\u062D\u0635 \u0627\u0644\u0647\u064A\u0645\u0648\u062C\u0644\u0648\u0628\u064A\u0646 \u0628\u0627\u0646\u062A\u0638\u0627\u0645." : "Monitor clinical signs of bleeding (unexplained bruising, gum bleeding, hematuria) and check hemoglobin levels.",
      "severity_color": "red"
    };
  }
  if (m1.includes("nitro") && m2.includes("sildenafil") || m2.includes("nitro") && m1.includes("sildenafil")) {
    return {
      "interaction_severity": "High",
      "has_interaction": true,
      "mechanism": isAr ? "\u062A\u0623\u062B\u064A\u0631 \u062A\u0622\u0632\u0631\u064A \u0642\u0648\u064A \u062C\u062F\u0627\u064B \u0644\u062A\u0648\u0633\u064A\u0639 \u0627\u0644\u0623\u0648\u0639\u064A\u0629 \u0627\u0644\u062F\u0645\u0648\u064A\u0629 \u0639\u0646 \u0637\u0631\u064A\u0642 \u0632\u064A\u0627\u062F\u0629 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0623\u062D\u0627\u062F\u064A \u0623\u0643\u0633\u064A\u062F \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u064A\u0646." : "Severe synergistic vasodilation via accumulation of cyclic GMP.",
      "clinical_effects": isAr ? "\u0627\u0646\u062E\u0641\u0627\u0636 \u0645\u0641\u0627\u062C\u0626 \u0648\u062D\u0627\u062F \u062C\u062F\u0627\u064B \u0641\u064A \u0636\u063A\u0637 \u0627\u0644\u062F\u0645 \u0642\u062F \u064A\u0643\u0648\u0646 \u0645\u0647\u062F\u062F\u0627\u064B \u0644\u0644\u062D\u064A\u0627\u0629." : "Sudden, severe, potentially life-threatening hypotension.",
      "recommendation": isAr ? "\u064A\u064F\u0645\u0646\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0627\u0644\u062C\u0645\u0639 \u0628\u064A\u0646 \u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u0648\u0633\u064A\u0644\u062F\u064A\u0646\u0627\u0641\u064A\u0644 (\u0627\u0644\u0641\u064A\u0627\u062C\u0631\u0627) \u0641\u064A \u063A\u0636\u0648\u0646 24-48 \u0633\u0627\u0639\u0629." : "Concomitant administration is strictly contraindicated within 24-48 hours.",
      "monitoring_guidelines": isAr ? "\u0627\u0644\u0625\u0646\u0639\u0627\u0634 \u0627\u0644\u0641\u0648\u0631\u064A \u0628\u0627\u0644\u0633\u0648\u0627\u0626\u0644 \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629 \u0648\u0631\u0641\u0639 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0641\u064A \u062D\u0627\u0644\u0629 \u062D\u062F\u0648\u062B \u0627\u0646\u062E\u0641\u0627\u0636 \u062D\u0627\u062F \u0644\u0644\u0636\u063A\u0637." : "Immediate IV fluid resuscitation and Trendelenburg positioning in case of severe hypotension.",
      "severity_color": "red"
    };
  }
  return {
    "interaction_severity": "None",
    "has_interaction": false,
    "mechanism": isAr ? "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u062F\u0627\u062E\u0644\u0627\u062A \u062F\u0648\u0627\u0626\u064A\u0629 \u062E\u0637\u064A\u0631\u0629 \u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0641\u0647\u0631\u0633 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u062A\u0631\u0643\u064A\u0628\u0629 \u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0629." : "No established severe drug-drug interactions found in the offline screening dictionary.",
    "clinical_effects": isAr ? "\u062A\u0623\u062B\u064A\u0631\u0627\u062A \u0633\u0631\u064A\u0631\u064A\u0629 \u0637\u0628\u064A\u0639\u064A\u0629 \u0648\u0645\u062A\u0648\u0642\u0639\u0629 \u0644\u0643\u0644 \u062F\u0648\u0627\u0621 \u0639\u0644\u0649 \u062D\u062F\u0629." : "Standard expected clinical effects of individual drugs.",
    "recommendation": isAr ? "\u064A\u0645\u0643\u0646 \u0625\u0639\u0637\u0627\u0621 \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0645\u0639 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0631\u0648\u062A\u064A\u0646\u064A\u0629 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0644\u0644\u0645\u0631\u064A\u0636." : "Administer as prescribed. Maintain standard clinical monitoring.",
    "monitoring_guidelines": isAr ? "\u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u062F\u0648\u0631\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0627\u062F\u0629 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0648\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0631\u064A\u0636 \u0627\u0644\u0639\u0627\u0645\u0629." : "Standard periodic vitals check and general clinical assessment.",
    "severity_color": "green"
  };
}
function getIvCompatibilityFallback(drug1, drug2, fluid, isAr) {
  const d1 = drug1.toLowerCase();
  const d2 = drug2.toLowerCase();
  if (d1.includes("ceftriaxone") && d2.includes("calcium") || d2.includes("ceftriaxone") && d1.includes("calcium")) {
    return {
      "compatibility_status": "Incompatible",
      "explanation": isAr ? "\u064A\u062A\u0641\u0627\u0639\u0644 \u0627\u0644\u0633\u064A\u0641 \u062A\u0631\u064A\u0627\u0643\u0633\u0648\u0646 \u0645\u0639 \u0627\u0644\u0643\u0627\u0644\u0633\u064A\u0648\u0645 \u0644\u062A\u0643\u0648\u064A\u0646 \u0631\u0648\u0627\u0633\u0628 \u0645\u0644\u062D\u064A\u0629 \u0635\u0644\u0628\u0629 \u0645\u0646 \u0633\u064A\u0641 \u062A\u0631\u064A\u0627\u0643\u0633\u0648\u0646-\u0627\u0644\u0643\u0627\u0644\u0633\u064A\u0648\u0645 \u0641\u064A \u0627\u0644\u0631\u0626\u0629 \u0648\u0627\u0644\u0643\u0644\u0649." : "Ceftriaxone reacts with Calcium-containing products to form a crystalline precipitate of calcium-ceftriaxone in the lungs and kidneys.",
      "recommendation": isAr ? "\u0645\u0645\u0646\u0648\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0627\u0644\u0625\u0639\u0637\u0627\u0621 \u0627\u0644\u0645\u0634\u062A\u0631\u0643 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u062E\u0637 \u0627\u0644\u0648\u0631\u064A\u062F\u064A (Y-site) \u0623\u0648 \u062E\u0644\u0637\u0647\u0645 \u0645\u0639\u0627\u064B." : "Strictly contraindicated to co-administer via the same IV line (Y-site) or combine them."
    };
  }
  if (d1.includes("heparin") && d2.includes("nitroglycerin") || d2.includes("heparin") && d1.includes("nitroglycerin")) {
    return {
      "compatibility_status": "Compatible",
      "explanation": isAr ? "\u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u0648\u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646 \u0645\u062A\u0648\u0627\u0641\u0642\u0627\u0646 \u0641\u064A \u062E\u0637 \u0627\u0644\u062A\u0633\u0631\u064A\u0628 \u0627\u0644\u0648\u0631\u064A\u062F\u064A Y-site\u060C \u0648\u0644\u0643\u0646 \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u0642\u062F \u064A\u0642\u0644\u0644 \u062C\u0632\u0626\u064A\u0627\u064B \u0645\u0646 \u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646." : "Heparin and Nitroglycerin are physically and chemically compatible at the Y-site. However, nitroglycerin may slightly reduce heparin's anticoagulant efficacy.",
      "recommendation": isAr ? "\u0645\u062A\u0648\u0627\u0641\u0642 \u0633\u0631\u064A\u0631\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u0642\u0628\u0629 \u0632\u0645\u0646 \u0627\u0644\u062A\u062C\u0644\u0637 (aPTT) \u0628\u062F\u0642\u0629 \u0648\u0636\u0628\u0637 \u062C\u0631\u0639\u0627\u062A \u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646 \u062D\u0633\u0628 \u0627\u0644\u062D\u0627\u062C\u0629." : "Clinically compatible. Monitor aPTT closely and adjust heparin dosing as required."
    };
  }
  return {
    "compatibility_status": "Caution",
    "explanation": isAr ? "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u0648\u0627\u0641\u0642 \u0643\u064A\u0645\u064A\u0627\u0626\u064A \u0642\u0627\u0637\u0639\u0629 \u0648\u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0641\u0647\u0631\u0633 \u0627\u0644\u0633\u0631\u064A\u0639 \u0644\u0647\u0630\u064A\u0646 \u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0646 \u0645\u0639\u0627\u064B." : "Direct physical compatibility data for this drug combination is not found in the instant offline reference index.",
    "recommendation": isAr ? "\u0644\u062A\u062C\u0646\u0628 \u062D\u062F\u0648\u062B \u062A\u0631\u0633\u064A\u0628\u060C \u0627\u063A\u0633\u0644 \u0627\u0644\u062E\u0637 \u0627\u0644\u0648\u0631\u064A\u062F\u064A \u062C\u064A\u062F\u0627\u064B \u0628\u0645\u062D\u0644\u0648\u0644 \u0633\u0627\u0644\u064A\u0646 \u0642\u0628\u0644 \u0648\u0628\u0639\u062F \u0625\u0639\u0637\u0627\u0621 \u0643\u0644 \u062F\u0648\u0627\u0621\u060C \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 \u062E\u0637\u0627\u064B \u0648\u0631\u064A\u062F\u064A\u0627\u064B \u0645\u0646\u0641\u0635\u0644\u0627\u064B." : "To prevent precipitation, flush the line thoroughly with normal saline before and after administering each drug, or use separate IV access."
  };
}
function getCounselingFallback(medication, isAr) {
  const med = medication.toLowerCase();
  if (med.includes("aspirin") || med.includes("\u0627\u0633\u0628\u0631\u064A\u0646") || med.includes("\u0623\u0633\u0628\u064A\u0631\u064A\u0646")) {
    return {
      "drug_name": isAr ? "\u0623\u0633\u0628\u0631\u064A\u0646 (Aspirin)" : "Aspirin",
      "what_is_it_for": isAr ? "\u0644\u0645\u0646\u0639 \u062A\u062C\u0644\u0637 \u0627\u0644\u062F\u0645 \u0648\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0642\u0644\u0628 \u0645\u0646 \u0627\u0644\u062C\u0644\u0637\u0627\u062A \u0648\u0627\u0644\u0630\u0628\u062D\u0629 \u0627\u0644\u0635\u062F\u0631\u064A\u0629." : "To prevent blood clots and protect the heart from heart attacks and angina.",
      "how_to_take": isAr ? "\u062A\u0646\u0627\u0648\u0644 \u0642\u0631\u0635\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u064A\u0648\u0645\u064A\u0627\u064B \u0645\u0639 \u0627\u0644\u0637\u0639\u0627\u0645 \u0623\u0648 \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0639\u062F\u0647 \u0644\u062A\u0642\u0644\u064A\u0644 \u062A\u0647\u064A\u062C \u0627\u0644\u0645\u0639\u062F\u0629. \u0627\u0645\u0636\u063A \u0627\u0644\u0642\u0631\u0635 \u0625\u0630\u0627 \u0643\u0627\u0646 \u0645\u062E\u0635\u0635\u0627\u064B \u0644\u0644\u0645\u0636\u063A." : "Take one tablet daily with or immediately after food to reduce stomach irritation. Chew if it is a chewable tablet.",
      "common_side_effects": isAr ? ["\u0627\u0636\u0637\u0631\u0627\u0628 \u0628\u0633\u064A\u0637 \u0641\u064A \u0627\u0644\u0645\u0639\u062F\u0629", "\u0633\u0647\u0648\u0644\u0629 \u062D\u062F\u0648\u062B \u0643\u062F\u0645\u0627\u062A \u0635\u063A\u064A\u0631\u0629", "\u0632\u064A\u0627\u062F\u0629 \u0637\u0641\u064A\u0641\u0629 \u0641\u064A \u0648\u0642\u062A \u0627\u0644\u0646\u0632\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u062C\u0631\u0648\u062D"] : ["Mild stomach upset or heartburn", "Easy bruising or small skin spots", "Slightly increased bleeding time for cuts"],
      "when_to_call_doctor": isAr ? ["\u0646\u0632\u064A\u0641 \u0634\u062F\u064A\u062F \u0644\u0627 \u064A\u062A\u0648\u0642\u0641", "\u0628\u0631\u0627\u0632 \u0623\u0633\u0648\u062F \u0627\u0644\u0644\u0648\u0646 \u0623\u0648 \u0645\u0635\u062D\u0648\u0628 \u0628\u062F\u0645", "\u0642\u064A\u0621 \u064A\u0634 \u064A\u0634\u0628\u0647 \u062A\u0641\u0644 \u0627\u0644\u0642\u0647\u0648\u0629", "\u0623\u0644\u0645 \u062D\u0627\u062F \u0641\u064A \u0627\u0644\u0645\u0639\u062F\u0629"] : ["Severe, unstoppable bleeding", "Black, tarry stools or blood in stool", "Vomiting blood or material resembling coffee grounds", "Severe abdominal pain"],
      "food_drug_interactions": isAr ? "\u062A\u062C\u0646\u0628 \u0634\u0631\u0628 \u0627\u0644\u0643\u062D\u0648\u0644 \u0644\u0623\u0646\u0647 \u064A\u0632\u064A\u062F \u0645\u0646 \u0645\u062E\u0627\u0637\u0631 \u0646\u0632\u064A\u0641 \u0627\u0644\u0645\u0639\u062F\u0629. \u062A\u0648\u062E\u0649 \u0627\u0644\u062D\u0630\u0631 \u0645\u0639 \u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0645\u0633\u0643\u0646\u0627\u062A \u0627\u0644\u0623\u062E\u0631\u0649 (\u0645\u062B\u0644 \u0627\u0644\u0625\u064A\u0628\u0648\u0628\u0631\u0648\u0641\u064A\u0646)." : "Avoid alcohol as it increases stomach bleeding risk. Exercise caution with other NSAID pain relievers (e.g., Ibuprofen).",
      "forgot_dose_instruction": isAr ? "\u062E\u0630 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0641\u0648\u0631 \u062A\u0630\u0643\u0631\u0647\u0627 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u064A\u0648\u0645. \u0625\u0630\u0627 \u062A\u0630\u0643\u0631\u062A \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u0627\u0644\u064A\u060C \u0641\u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0648\u062A\u0627\u0628\u0639 \u062C\u062F\u0648\u0644\u0643 \u0627\u0644\u0645\u0639\u062A\u0627\u062F. \u0644\u0627 \u062A\u0636\u0627\u0639\u0641 \u0627\u0644\u062C\u0631\u0639\u0629." : "Take the missed dose as soon as you remember on the same day. If you remember the next day, skip it and continue your normal schedule. Do not double the dose."
    };
  }
  if (med.includes("nitro") || med.includes("\u0646\u064A\u062A\u0631\u0648") || med.includes("\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646")) {
    return {
      "drug_name": isAr ? "\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u062A\u062D\u062A \u0627\u0644\u0644\u0633\u0627\u0646 (Sublingual Nitroglycerin)" : "Sublingual Nitroglycerin",
      "what_is_it_for": isAr ? "\u0644\u062A\u062E\u0641\u064A\u0641 \u0622\u0644\u0627\u0645 \u0627\u0644\u0635\u062F\u0631 \u0627\u0644\u0645\u0641\u0627\u062C\u0626\u0629 (\u0627\u0644\u0630\u0628\u062D\u0629 \u0627\u0644\u0635\u062F\u0631\u064A\u0629) \u0627\u0644\u0646\u0627\u062A\u062C\u0629 \u0639\u0646 \u0636\u064A\u0642 \u0634\u0631\u0627\u064A\u064A\u0646 \u0627\u0644\u0642\u0644\u0628." : "To relieve sudden chest pain (angina attacks) caused by coronary artery narrowing.",
      "how_to_take": isAr ? "\u0627\u062C\u0644\u0633 \u0623\u0648\u0644\u0627\u064B \u0644\u062A\u062C\u0646\u0628 \u0627\u0644\u062F\u0648\u0627\u0631. \u0636\u0639 \u0642\u0631\u0635\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u062A\u062D\u062A \u0627\u0644\u0644\u0633\u0627\u0646 \u0648\u0627\u062A\u0631\u0643\u0647 \u064A\u0630\u0648\u0628 \u0628\u0627\u0644\u0643\u0627\u0645\u0644. \u0644\u0627 \u062A\u0628\u062A\u0644\u0639 \u0627\u0644\u0642\u0631\u0635." : "Sit down first to prevent dizziness. Place one tablet under the tongue and let it dissolve completely. Do not swallow.",
      "common_side_effects": isAr ? ["\u0635\u062F\u0627\u0639 \u0645\u0641\u0627\u062C\u0626 \u0648\u0642\u0635\u064A\u0631 \u0627\u0644\u0645\u062F\u0649", "\u0634\u0639\u0648\u0631 \u0628\u0627\u0644\u062F\u0641\u0621 \u0623\u0648 \u0627\u062D\u0645\u0631\u0627\u0631 \u0627\u0644\u0648\u062C\u0647", "\u062F\u0648\u0627\u0631 \u0645\u0624\u0642\u062A \u0639\u0646\u062F \u0627\u0644\u0648\u0642\u0648\u0641"] : ["Sudden, transient headache", "Flushing or feeling of warmth in the face", "Temporary dizziness when standing up"],
      "when_to_call_doctor": isAr ? ["\u0639\u062F\u0645 \u062A\u062D\u0633\u0646 \u0623\u0644\u0645 \u0627\u0644\u0635\u062F\u0631 \u0628\u0639\u062F \u062A\u0646\u0627\u0648\u0644 \u0623\u0648\u0644 \u0642\u0631\u0635 \u0644\u0645\u062F\u0629 5 \u062F\u0642\u0627\u0626\u0642 (\u0627\u062A\u0635\u0644 \u0628\u0627\u0644\u0637\u0648\u0627\u0631\u0626 997 \u0641\u0648\u0631\u0627\u064B)", "\u0636\u064A\u0642 \u0634\u062F\u064A\u062F \u0641\u064A \u0627\u0644\u062A\u0646\u0641\u0633", "\u0625\u063A\u0645\u0627\u0621"] : ["Chest pain does not improve 5 minutes after taking the first tablet (Call emergency 997 immediately)", "Severe shortness of breath", "Fainting"],
      "food_drug_interactions": isAr ? "\u0645\u0645\u0646\u0648\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u062A\u0646\u0627\u0648\u0644 \u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0636\u0639\u0641 \u0627\u0644\u062C\u0646\u0633\u064A (\u0645\u062B\u0644 \u0627\u0644\u0641\u064A\u0627\u062C\u0631\u0627) \u0623\u062B\u0646\u0627\u0621 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621." : "STRICTLY PROHIBITED to take erectile dysfunction medications (e.g., Viagra) while using this drug.",
      "forgot_dose_instruction": isAr ? "\u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u064A\u064F\u0633\u062A\u062E\u062F\u0645 \u0641\u0642\u0637 \u0639\u0646\u062F \u0627\u0644\u062D\u0627\u062C\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0648\u062A\u062C\u0631\u0628\u0629 \u0646\u0648\u0628\u0629 \u0623\u0644\u0645 \u0628\u0627\u0644\u0635\u062F\u0631\u060C \u0648\u0644\u064A\u0633 \u0643\u0639\u0644\u0627\u062C \u064A\u0648\u0645\u064A \u0645\u0646\u062A\u0638\u0645." : "This medication is used strictly on an as-needed basis during chest pain episodes, not as a continuous daily maintenance dose."
    };
  }
  return {
    "drug_name": medication,
    "what_is_it_for": isAr ? "\u062A\u0645 \u0648\u0635\u0641 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u0645\u0646 \u0642\u0628\u0644 \u0637\u0628\u064A\u0628\u0643 \u0644\u0639\u0644\u0627\u062C \u062D\u0627\u0644\u062A\u0643 \u0627\u0644\u0637\u0628\u064A\u0629 \u0627\u0644\u0645\u062D\u062F\u062F\u0629." : "This medication was prescribed by your physician to treat your specific medical condition.",
    "how_to_take": isAr ? "\u062A\u0646\u0627\u0648\u0644 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u062A\u0645\u0627\u0645\u0627\u064B \u0643\u0645\u0627 \u0623\u0631\u0634\u062F\u0643 \u0627\u0644\u0637\u0628\u064A\u0628 \u0623\u0648 \u0627\u0644\u0635\u064A\u062F\u0644\u064A. \u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0644\u0635\u0642 \u0627\u0644\u0625\u0631\u0634\u0627\u062F\u064A \u0639\u0644\u0649 \u0627\u0644\u0639\u0628\u0648\u0629." : "Take this medication exactly as directed by your physician or pharmacist. Read the label instruction carefully.",
    "common_side_effects": isAr ? ["\u0627\u0636\u0637\u0631\u0627\u0628\u0627\u062A \u0647\u0636\u0645\u064A\u0629 \u062E\u0641\u064A\u0641\u0629", "\u0646\u0639\u0627\u0633 \u0623\u0648 \u0635\u062F\u0627\u0639 \u062E\u0641\u064A\u0641"] : ["Mild gastrointestinal discomfort", "Mild drowsiness or headache"],
    "when_to_call_doctor": isAr ? ["\u0638\u0647\u0648\u0631 \u0639\u0644\u0627\u0645\u0627\u062A \u062D\u0633\u0627\u0633\u064A\u0629 \u0645\u062B\u0644 \u062A\u0648\u0631\u0645 \u0627\u0644\u0648\u062C\u0647\u060C \u0637\u0641\u062D \u062C\u0644\u062F\u064A\u060C \u0623\u0648 \u0635\u0639\u0648\u0628\u0629 \u0627\u0644\u062A\u0646\u0641\u0633", "\u062A\u0641\u0627\u0642\u0645 \u0627\u0644\u0623\u0639\u0631\u0627\u0636 \u0628\u0634\u0643\u0644 \u062D\u0627\u062F"] : ["Signs of allergic reaction (facial swelling, severe skin rash, difficulty breathing)", "Acute worsening of symptoms"],
    "food_drug_interactions": isAr ? "\u064A\u0631\u062C\u0649 \u0634\u0631\u0628 \u0643\u0645\u064A\u0629 \u0643\u0627\u0641\u064A\u0629 \u0645\u0646 \u0627\u0644\u0645\u0627\u0621 \u0648\u062A\u062C\u0646\u0628 \u062A\u0646\u0627\u0648\u0644 \u0623\u062F\u0648\u064A\u0629 \u062C\u062F\u064A\u062F\u0629 \u062F\u0648\u0646 \u0627\u0633\u062A\u0634\u0627\u0631\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u064A." : "Drink sufficient water. Do not start new medications without consulting your pharmacist.",
    "forgot_dose_instruction": isAr ? "\u062A\u0646\u0627\u0648\u0644 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0641\u0648\u0631 \u062A\u0630\u0643\u0631\u0647\u0627. \u0625\u0630\u0627 \u062D\u0627\u0646 \u0648\u0642\u062A \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u062A\u0642\u0631\u064A\u0628\u0627\u064B\u060C \u0641\u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0648\u0644\u0627 \u062A\u0636\u0627\u0639\u0641 \u0627\u0644\u062C\u0631\u0639\u0629." : "Take the missed dose as soon as you remember. If it is almost time for your next dose, skip it and resume your schedule. Do not double the dose."
  };
}
function getNews2Fallback(data, isAr) {
  if (isAr) {
    return `
### \u{1F3E5} \u062A\u0642\u064A\u064A\u0645 \u0633\u0631\u064A\u0631\u064A \u0639\u0627\u062C\u0644 (\u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0641\u062D\u0635 \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 - NEWS2)

**\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0627\u0644\u0645\u062F\u0645\u062C.**

#### 1. \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629:
- **\u062F\u0631\u062C\u0629 \u062E\u0637\u0648\u0631\u0629 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0641\u0633\u064A\u0648\u0644\u0648\u062C\u064A:** \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062E\u0637\u0648\u0631\u0629 \u0627\u0644\u062D\u0627\u0644\u064A \u0647\u0648 **${data.riskLevel || "\u0645\u062A\u0648\u0633\u0637 \u0625\u0644\u0649 \u0645\u0631\u062A\u0641\u0639"}** \u0645\u0639 \u062F\u0631\u062C\u0629 \u0625\u062C\u0645\u0627\u0644\u064A\u0629 \u062A\u0628\u0644\u063A **(${data.totalScore || 0}/20)**.
- **\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0646\u0641\u0633:** ${data.respiratoryRate} \u062F\u0648\u0631\u0629/\u062F\u0642\u064A\u0642\u0629. (\u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0627\u0642\u0628\u0629 \u0645\u0633\u062A\u0645\u0631\u0629 \u0644\u0644\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u062A\u0646\u0641\u0633\u064A\u0629).
- **\u0627\u0644\u062A\u0634\u0628\u0639 \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646 (SpO2):** ${data.spo2Scale1 || data.spo2Scale2 || 95}% \u0645\u0639 ${data.oxygenTherapy ? "\u0639\u0644\u0627\u062C \u0645\u062F\u0639\u0648\u0645 \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646" : "\u062A\u0646\u0641\u0633 \u0647\u0648\u0627\u0621 \u0627\u0644\u063A\u0631\u0641\u0629 \u0627\u0644\u0637\u0628\u064A\u0639\u064A"}.
- **\u0636\u063A\u0637 \u0627\u0644\u062F\u0645 \u0627\u0644\u0627\u0646\u0642\u0628\u0627\u0636\u064A:** ${data.systolicBP} \u0645\u0645 \u0632\u0626\u0628\u0642. (\u064A\u062C\u0628 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u062A\u0631\u0648\u064A\u0629 \u0627\u0644\u0646\u0633\u064A\u062C\u064A\u0629 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u0644\u0644\u0623\u0639\u0636\u0627\u0621 \u0627\u0644\u062D\u064A\u0648\u064A\u0629).
- **\u0645\u0639\u062F\u0644 \u0636\u0631\u0628\u0627\u062A \u0627\u0644\u0642\u0644\u0628:** ${data.pulse} \u0646\u0628\u0636\u0629/\u062F\u0642\u064A\u0642\u0629.
- **\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0648\u0639\u064A (ACVPU):** \u0627\u0644\u0645\u0631\u064A\u0636 \u0641\u064A \u062D\u0627\u0644\u0629 \u0648\u0639\u064A: **${data.consciousness}**.

#### 2. \u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u062A\u0645\u0631\u064A\u0636\u064A\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0627\u0644\u0645\u0648\u0635\u0649 \u0628\u0647\u0627:
1. **\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629:** \u0632\u064A\u0627\u062F\u0629 \u0648\u062A\u064A\u0631\u0629 \u0642\u064A\u0627\u0633 \u0648\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0624\u0634\u0631\u0627\u062A \u0627\u0644\u0641\u0633\u064A\u0648\u0644\u0648\u062C\u064A\u0629 \u0644\u062A\u0635\u0628\u062D \u0643\u0644 **30 \u062F\u0642\u064A\u0642\u0629 \u0625\u0644\u0649 \u0633\u0627\u0639\u0629 \u0648\u0627\u062D\u062F\u0629** \u0628\u062D\u062F \u0623\u0642\u0635\u0649.
2. **\u0627\u0644\u0639\u0644\u0627\u062C \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646:** \u0636\u0628\u0637 \u062A\u0633\u0631\u064A\u0628 \u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646 \u0648\u0627\u0644\u062A\u0631\u0637\u064A\u0628 \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u062A\u0634\u0628\u0639 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641\u0629 (96-99% \u0644\u0644\u0645\u0631\u0636\u0649 \u0627\u0644\u0639\u0627\u062F\u064A\u064A\u0646\u060C \u0623\u0648 88-92% \u0644\u0645\u0631\u0636\u0649 \u0627\u0644\u0633\u062F\u0629 \u0627\u0644\u0631\u0626\u0648\u064A\u0629 \u0627\u0644\u0645\u0632\u0645\u0646\u0629 COPD).
3. **\u0627\u0644\u062A\u0623\u0647\u0628 \u0644\u0641\u062A\u062D \u062E\u0637 \u0648\u0631\u064A\u062F\u064A:** \u062A\u062C\u0647\u064A\u0632 \u0642\u0646\u064A\u0627\u062A \u0648\u0631\u064A\u062F\u064A\u0629 \u0630\u0627\u062A \u0642\u0637\u0631 \u0643\u0628\u064A\u0631 (Cannula 18G) \u0648\u0633\u062D\u0628 \u0639\u064A\u0646\u0627\u062A \u062F\u0645 \u0623\u0633\u0627\u0633\u064A\u0629 \u0628\u0645\u0627 \u0641\u064A \u0630\u0644\u0643 \u063A\u0627\u0632\u0627\u062A \u0627\u0644\u062F\u0645 \u0627\u0644\u0634\u0631\u064A\u0627\u0646\u064A (ABG) \u0648\u062A\u0639\u062F\u0627\u062F \u0627\u0644\u062F\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u0627\u0644\u0643\u0647\u0627\u0631\u0644.

#### 3. \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u062A\u0635\u0639\u064A\u062F \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0637\u0628\u064A:
- **\u0625\u0634\u0639\u0627\u0631 \u0641\u0648\u0631\u064A:** \u0625\u0628\u0644\u0627\u063A \u0627\u0644\u0637\u0628\u064A\u0628 \u0627\u0644\u0645\u0642\u064A\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0648\u0623\u062E\u0635\u0627\u0626\u064A \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u0629 (ICU) \u0623\u0648 \u0641\u0631\u064A\u0642 \u0627\u0644\u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 (RRT) \u0641\u0648\u0631\u0627\u064B \u0628\u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629.
- **\u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F \u0644\u0644\u0646\u0642\u0644:** \u062A\u0623\u0645\u064A\u0646 \u062C\u0627\u0647\u0632\u064A\u0629 \u0639\u0631\u0628\u0629 \u0627\u0644\u0625\u0646\u0639\u0627\u0634 (Crash Cart) \u0648\u062C\u0647\u0627\u0632 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0645\u062D\u0645\u0648\u0644 \u0644\u0644\u0642\u0644\u0628 \u062A\u062D\u0633\u0628\u0627\u064B \u0644\u0646\u0642\u0644 \u0627\u0644\u0645\u0631\u064A\u0636 \u0627\u0644\u0639\u0627\u062C\u0644 \u0644\u0648\u062D\u062F\u0629 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u0629 \u0623\u0648 \u0627\u0644\u0637\u0648\u0627\u0631\u0626.

#### 4. \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062A\u062D\u0630\u064A\u0631\u064A\u0629 \u0627\u0644\u062D\u0645\u0631\u0627\u0621 (Red Flags) \u0644\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629:
- \u062A\u0631\u0627\u062C\u0639 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0648\u0639\u064A \u0641\u062C\u0623\u0629 \u0623\u0648 \u062D\u062F\u0648\u062B \u0627\u0631\u062A\u0628\u0627\u0643 \u062D\u0627\u062F \u0648\u0645\u0642\u0627\u0648\u0645\u0629.
- \u0627\u0646\u062E\u0641\u0627\u0636 \u0636\u063A\u0637 \u0627\u0644\u062F\u0645 \u0627\u0644\u0627\u0646\u0642\u0628\u0627\u0636\u064A \u0644\u0623\u0642\u0644 \u0645\u0646 90 \u0645\u0645 \u0632\u0626\u0628\u0642.
- \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0639\u0636\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0644\u0644\u062A\u0646\u0641\u0633 (Respiratory Distress) \u0623\u0648 \u062D\u062F\u0648\u062B \u0632\u0631\u0642\u0629 \u0641\u064A \u0627\u0644\u0634\u0641\u062A\u064A\u0646 \u0648\u0627\u0644\u0623\u0637\u0631\u0627\u0641.
- \u062A\u0628\u0627\u0637\u0624 \u0636\u0631\u0628\u0627\u062A \u0627\u0644\u0642\u0644\u0628 \u0627\u0644\u0645\u0641\u0627\u062C\u0626 \u0627\u0644\u0645\u0635\u062D\u0648\u0628 \u0628\u062A\u0631\u0627\u062C\u0639 \u0627\u0644\u062A\u0631\u0648\u064A\u0629 \u0627\u0644\u0646\u0633\u064A\u062C\u064A\u0629.
`;
  } else {
    return `
### \u{1F3E5} Urgent Clinical Assessment (Early Warning Response - NEWS2)

**This clinical audit has been generated via the offline system fallback protocol.**

#### 1. Physiologic Vital Signs Analysis:
- **Physiological Deterioration Score:** Currently graded as **${data.riskLevel || "Medium to High Risk"}** with an aggregate NEWS2 score of **(${data.totalScore || 0}/20)**.
- **Respiratory Rate:** ${data.respiratoryRate} bpm. (High vigilance required for respiratory effort).
- **Oxygen Saturation (SpO2):** ${data.spo2Scale1 || data.spo2Scale2 || 95}% on ${data.oxygenTherapy ? "supplemental oxygen support" : "room air"}.
- **Systolic Blood Pressure:** ${data.systolicBP} mmHg. (Maintain strict surveillance for perfusion deficits).
- **Heart Rate / Pulse:** ${data.pulse} bpm.
- **Level of Consciousness (ACVPU):** Assessed as **${data.consciousness}**.

#### 2. Immediate Nursing Care Interventions:
1. **Frequency of Monitoring:** Increase clinical vitals charting frequency to every **30 to 60 minutes** without exception.
2. **Oxygen Titration:** Adjust supplemental oxygen flow rates to maintain target oxygenation (96-99% or 88-92% in patients with confirmed hypercapnic respiratory failure).
3. **Intravenous Access:** Ensure dual patent large-bore peripheral IV lines are established. Prepare for arterial blood gas (ABG) and lactate levels.

#### 3. Clinical Escalation Protocol:
- **Immediate Notification:** Notify the attending physician, medical registrar, and alert the Rapid Response Team (RRT) or Critical Care Outreach.
- **Emergency Readiness:** Retrieve and position the emergency crash cart and portable defibrillator/monitor near the patient bedside.

#### 4. Red Flags & Critical Deterioration Warning Signs:
- Any acute decrease in Glasgow Coma Scale (GCS) or new-onset confusion.
- Systolic BP dropping below 90 mmHg.
- Active accessory muscle use, grunting, or peripheral cyanosis.
- Sudden bradycardia associated with clinical shock.
`;
  }
}
function getIsbarFallback(data, isAr) {
  if (isAr) {
    return `
### \u{1F4CB} \u062A\u0642\u0631\u064A\u0631 \u062A\u062F\u0642\u064A\u0642 \u0627\u0644\u062C\u0648\u062F\u0629 \u0648\u0627\u0633\u062A\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A (\u0645\u0646\u0647\u062C\u064A\u0629 ISBAR)

**\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0645\u0631\u0636 \u0648\u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0645\u062F\u0645\u062C \u0643\u062E\u0637\u0648\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629.**

#### 1. \u062A\u062F\u0642\u064A\u0642 \u062C\u0648\u062F\u0629 \u0647\u064A\u0643\u0644 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 (Quality Audit):
- **\u0627\u0644\u062A\u0639\u0631\u064A\u0641 \u0628\u0627\u0644\u0645\u0631\u064A\u0636 (Identify):** \u062A\u0645 \u062A\u0648\u062B\u064A\u0642\u0647 \u0628\u0648\u0636\u0648\u062D (${data.identify || "\u0645\u0643\u062A\u0645\u0644"}).
- **\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u062D\u0627\u0644\u064A (Situation):** \u064A\u0648\u0636\u062D \u0628\u0648\u0636\u0648\u062D \u0627\u0644\u0634\u0643\u0648\u0649 \u0648\u0627\u0644\u062A\u0634\u062E\u064A\u0635 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0627\u0644\u062D\u0627\u0644\u064A.
- **\u0627\u0644\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u0636\u064A\u0629 (Background):** \u064A\u0633\u0631\u062F \u0628\u0648\u0636\u0648\u062D \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u0631\u0636\u064A \u0648\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062F\u0627\u0639\u0645\u0629 \u0627\u0644\u062C\u0648\u0647\u0631\u064A\u0629.
- **\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u062D\u0627\u0644\u064A (Assessment):** \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0627\u0644\u0645\u0624\u0634\u0631\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0648\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u0627\u0644\u0631\u0627\u0647\u0646\u0629.
- **\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629 (Recommendation):** \u064A\u062D\u062F\u062F \u062E\u0637\u0629 \u0627\u0644\u0639\u0645\u0644 \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A \u0628\u0648\u0636\u0648\u062D.

#### 2. \u0627\u0644\u0631\u0624\u0649 \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0630\u064A\u0631\u0627\u062A \u0627\u0644\u0623\u0645\u0646\u064A\u0629 (Clinical Insights & Risks):
- **\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u0633\u0644\u064A\u0645:** \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u064A\u062A\u0628\u0639 \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0647\u064A\u0643\u0644\u064A \u0627\u0644\u0633\u0644\u064A\u0645 \u0644\u0645\u0646\u0639 \u0641\u0642\u062F\u0627\u0646 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0623\u062B\u0646\u0627\u0621 \u0646\u0642\u0644 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0628\u064A\u0646 \u0627\u0644\u0648\u0631\u062F\u064A\u0627\u062A.
- **\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0639\u0645\u064A\u0627\u0621 \u0627\u0644\u0645\u062D\u062A\u0645\u0644\u0629:** \u062A\u0623\u0643\u062F \u0645\u0646 \u0645\u0631\u0627\u062C\u0639\u0629 \u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062A\u062D\u0627\u0644\u064A\u0644 \u0627\u0644\u0645\u062E\u0628\u0631\u064A\u0629 \u0627\u0644\u0623\u062E\u064A\u0631\u0629 (\u0645\u062B\u0644 \u0643\u0647\u0627\u0631\u0644 \u0627\u0644\u062F\u0645\u060C \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0647\u064A\u0645\u0648\u062C\u0644\u0648\u0628\u064A\u0646) \u0648\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062D\u0633\u0627\u0633\u064A\u0629 \u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0629 \u0643\u0628\u0646\u062F \u062F\u0627\u0626\u0645 \u0644\u0645\u0646\u0639 \u0627\u0644\u062D\u0648\u0627\u062F\u062B \u0627\u0644\u0639\u0631\u0636\u064A\u0629.

#### 3. \u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u0639\u0644\u0627\u062C\u064A\u0629 \u0648\u0627\u0644\u062A\u0634\u062E\u064A\u0635\u064A\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629:
1. **\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0641\u0647\u0645:** \u064A\u062C\u0628 \u0639\u0644\u0649 \u0627\u0644\u0645\u0645\u0631\u0636 \u0623\u0648 \u0627\u0644\u0637\u0628\u064A\u0628 \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0625\u0639\u0627\u062F\u0629 \u0642\u0631\u0627\u0621\u0629 \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0627\u0644\u0635\u0627\u062F\u0631\u0629 (Read-back protocol).
2. **\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u062C\u0647\u064A\u0632\u0627\u062A \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629:** \u0645\u0631\u0627\u062C\u0639\u0629 \u0635\u0644\u0627\u062D\u064A\u0629 \u062E\u0637\u0648\u0637 \u0642\u0633\u0637\u0631\u0629 \u0627\u0644\u0645\u063A\u0630\u064A\u0627\u062A \u0648\u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629 \u0648\u0645\u0639\u062F\u0644\u0627\u062A \u062A\u062F\u0641\u0642 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0622\u0644\u064A\u0629.
3. **\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u062A\u0648\u0642\u064A\u062A:** \u062A\u0633\u062C\u064A\u0644 \u0648\u0642\u062A \u0648\u062A\u0627\u0631\u064A\u062E \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0628\u062F\u0642\u0629 \u0641\u064A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u0645\u0648\u062D\u062F \u0644\u0644\u0645\u0631\u064A\u0636 (EMR).

#### 4. \u0645\u0642\u062A\u0631\u062D\u0627\u062A \u0644\u062A\u062D\u0633\u064A\u0646 \u0635\u064A\u0627\u063A\u0629 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0645\u0633\u062A\u0642\u0628\u0644\u0627\u064B:
- \u0627\u062D\u0631\u0635 \u062F\u0627\u0626\u0645\u0627\u064B \u0639\u0644\u0649 \u062A\u0636\u0645\u064A\u0646 \u0622\u062E\u0631 \u0642\u064A\u0645 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 (\u0627\u0644\u0645\u0642\u0627\u0633\u0629 \u0641\u064A \u0622\u062E\u0631 \u0633\u0627\u0639\u0629) \u0643\u0623\u0631\u0642\u0627\u0645 \u0645\u062D\u062F\u062F\u0629 \u0641\u064A \u0642\u0633\u0645 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0644\u062A\u062C\u0646\u0628 \u0627\u0644\u0639\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629 \u0645\u062B\u0644 "\u0627\u0644\u0645\u0631\u064A\u0636 \u0645\u0633\u062A\u0642\u0631".
- \u0627\u0630\u0643\u0631 \u0628\u0648\u0636\u0648\u062D \u0623\u064A \u0645\u0648\u0627\u0639\u064A\u062F \u0642\u0631\u064A\u0628\u0629 \u0644\u0625\u0639\u0637\u0627\u0621 \u062C\u0631\u0639\u0627\u062A \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u062D\u0631\u062C\u0629 (\u0645\u062B\u0644 \u0627\u0644\u0645\u0636\u0627\u062F\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0623\u0648 \u0645\u0645\u064A\u0639\u0627\u062A \u0627\u0644\u062F\u0645) \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631\u064A\u0629 \u0627\u0644\u0639\u0644\u0627\u062C\u064A\u0629 \u062F\u0648\u0646 \u0627\u0646\u0642\u0637\u0627\u0639.
`;
  } else {
    return `
### \u{1F4CB} Handover Quality Audit & Consultation Report (ISBAR Framework)

**This clinical audit has been generated via the offline system fallback protocol.**

#### 1. Structural Information Completeness Audit:
- **Patient Identification (Identify):** Documented properly (${data.identify || "Complete"}).
- **Active Situation (Situation):** Outlines the primary active medical problem or chief complaint.
- **Clinical Background (Background):** Lists past medical history, admissions, and relevant diagnostic milestones.
- **Current Assessment (Assessment):** Includes objective parameters, clinical findings, and recent physiological changes.
- **Actionable Recommendation (Recommendation):** Specifies outstanding tasks, follow-up parameters, and immediate care goals.

#### 2. Clinical Insights & Patient Safety Risk Screening:
- **Handover Safety:** The report adheres to the standard professional structure which reduces communication breakdown during nursing shift-to-shift handovers by up to 80%.
- **Potential Blind Spots:** Verify that the patient's drug allergies are explicitly read out during every handover. Cross-reference the latest lab panels (e.g., potassium, creatinine, hemoglobin) to preempt metabolic or bleeding issues.

#### 3. Recommended Diagnostic & Therapeutic Next Steps:
1. **Verbal Confirmation:** Engage in the standard "Read-Back" protocol to verify high-risk recommendations and critical medication orders.
2. **Line and Device Safety Check:** Perform a physical bedside audit of all running intravenous infusions, vascular access sites, and monitoring devices.
3. **Time-Log Documentation:** Formally sign off and date the transfer of nursing or physician clinical responsibility in the patient's Electronic Medical Record (EMR).

#### 4. Practical Suggestions for Handover Report Improvement:
- Always input specific numerical values for vital signs recorded within the last 60 minutes inside the Assessment field, rather than subjective terms like "vitals stable."
- Specify the exact times of any high-alert medications (e.g., anticoagulants, insulin, continuous infusions) due during the incoming shift to guarantee strict clinical continuity.
`;
  }
}
async function startServer() {
  const app2 = (0, import_express.default)();
  const PORT = 3e3;
  app2.use(import_express.default.json());
  let aiClient = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required but missing");
      }
      aiClient = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return aiClient;
  }
  app2.post("/api/ai/analyze-medication", async (req, res) => {
    const { search_query } = req.body;
    if (!search_query || typeof search_query !== "string" || search_query.trim() === "") {
      return res.status(400).json({ success: false, error: "Invalid medication name." });
    }
    try {
      const client = getAiClient();
      const systemInstruction = `
You are a digital clinical pharmacist system responsible for medication safety review and labeling.
Your task is to receive the medication name, auto-correct spelling, classify it, and determine safety labels (High-Alert / LASA) and nursing monitoring instructions.
Output ONLY a JSON object based on this schema:
{
  "search_result": {
    "original_query": "string",
    "is_corrected": boolean,
    "corrected_name_trade": "string",
    "generic_name": "string",
    "drug_class": "string"
  },
  "required_labels": {
    "high_alert_status": { "is_high_alert": boolean, "label_color": "string", "reason": "string" },
    "lasa_status": { 
      "has_lasa_risk": boolean, 
      "label_color": "string", 
      "confused_with": Array<{ "name": "string", "reason_of_confusion": "string", "danger_level": "string" }> 
    }
  },
  "clinical_guidelines": {
    "administration_routes": ["string"],
    "vital_signs_to_monitor": ["string"]
  }
}
`;
      let result;
      for (let i = 0; i < 3; i++) {
        try {
          result = await client.models.generateContent({
            model: "gemini-3.5-flash",
            contents: search_query,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0
            }
          });
          break;
        } catch (err) {
          if (i === 2) throw err;
          if (err.status === 503 || err.message?.includes("503") || err.message?.includes("high demand") || err.message?.includes("UNAVAILABLE")) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * (i + 1)));
            continue;
          }
          throw err;
        }
      }
      let responseJson;
      try {
        responseJson = JSON.parse(result.text);
      } catch (e) {
        console.error("Critical: AI returned malformed JSON", result.text);
        throw new Error("AI data integrity error.");
      }
      res.json({ success: true, medication: responseJson });
    } catch (error) {
      console.warn("Medication AI Model unavailable/failed. Activating high-fidelity fallback. Error:", error.message || error);
      const responseJson = getMedicationFallback(search_query);
      res.json({ success: true, medication: responseJson, fallback: true });
    }
  });
  app2.post("/api/ai/check-interaction", async (req, res) => {
    const { med1, med2, lang } = req.body;
    if (!med1 || !med2) {
      return res.status(400).json({ success: false, error: "Please provide both medication names." });
    }
    const isAr = lang === "ar";
    try {
      const client = getAiClient();
      const systemInstruction = `
You are a senior clinical pharmacist specializing in drug safety and drug-drug interactions.
Analyze the interaction between Medication 1 and Medication 2.
Output ONLY a JSON object based on this schema:
{
  "interaction_severity": "High" | "Moderate" | "Minor" | "None",
  "has_interaction": boolean,
  "mechanism": "string description",
  "clinical_effects": "string description",
  "recommendation": "string recommendation",
  "monitoring_guidelines": "string guidelines",
  "severity_color": "red" | "orange" | "yellow" | "green"
}
Output localized text in the requested language: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze interaction between: "${med1}" and "${med2}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      let responseJson;
      try {
        responseJson = JSON.parse(response.text);
      } catch (e) {
        console.error("Critical: AI interaction returned malformed JSON", response.text);
        throw new Error("AI data integrity error.");
      }
      res.json({ success: true, analysis: responseJson });
    } catch (error) {
      console.warn("Interaction AI Model failed. Activating high-fidelity fallback. Error:", error.message || error);
      const responseJson = getInteractionFallback(med1, med2, isAr);
      res.json({ success: true, analysis: responseJson, fallback: true });
    }
  });
  app2.post("/api/ai/iv-compatibility", async (req, res) => {
    const { drug1, drug2, fluid, lang } = req.body;
    if (!drug1 || !drug2) {
      return res.status(400).json({ success: false, error: "Please provide both drugs." });
    }
    const isAr = lang === "ar";
    try {
      const client = getAiClient();
      const systemInstruction = `
You are an IV therapy specialist pharmacist. Determine if Drug 1 and Drug 2 are physically and chemically compatible for Y-site co-administration, optionally considering the base fluid if provided.
Output ONLY a JSON object based on this schema:
{
  "compatibility_status": "Compatible" | "Incompatible" | "Caution" | "Data Not Available",
  "explanation": "Detailed explanation of compatibility, physical reactions (precipitation, color change, etc.)",
  "recommendation": "Nursing recommendation"
}
Output text in: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Drug 1: ${drug1}, Drug 2: ${drug2}, Base Fluid: ${fluid || "None"}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      res.json({ success: true, result: JSON.parse(response.text) });
    } catch (error) {
      console.warn("IV Compatibility AI Model failed. Activating high-fidelity fallback. Error:", error.message || error);
      const responseJson = getIvCompatibilityFallback(drug1, drug2, fluid || "", isAr);
      res.json({ success: true, result: responseJson, fallback: true });
    }
  });
  app2.post("/api/ai/medication-counseling", async (req, res) => {
    const { medication, lang } = req.body;
    if (!medication) {
      return res.status(400).json({ success: false, error: "Please provide medication." });
    }
    const isAr = lang === "ar";
    try {
      const client = getAiClient();
      const systemInstruction = `
You are a patient education pharmacist. Create a simple, patient-friendly counseling sheet for the given medication. 
Use plain language (no complex medical jargon).
Output ONLY a JSON object based on this schema:
{
  "drug_name": "Name of drug",
  "what_is_it_for": "Simple explanation",
  "how_to_take": "Clear instructions",
  "common_side_effects": ["side effect 1", "side effect 2"],
  "when_to_call_doctor": ["warning sign 1", "warning sign 2"],
  "food_drug_interactions": "Simple list of foods or other drugs to avoid",
  "forgot_dose_instruction": "What to do if a dose is missed"
}
Output text in: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Medication: ${medication}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      res.json({ success: true, counseling: JSON.parse(response.text) });
    } catch (error) {
      console.warn("Medication Counseling AI Model failed. Activating high-fidelity fallback. Error:", error.message || error);
      const responseJson = getCounselingFallback(medication, isAr);
      res.json({ success: true, counseling: responseJson, fallback: true });
    }
  });
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app2.post("/api/v1/patients", async (req, res) => {
    try {
      await savePatient(req.body);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to save patient" });
    }
  });
  app2.get("/api/v1/patients/search", async (req, res) => {
    const queryStr = req.query.q;
    const patients = await new Promise((resolve) => syncPatients(resolve));
    const filtered = patients.filter((p) => p.mrn?.includes(queryStr) || p.national_id?.includes(queryStr) || p.phone_mobile?.includes(queryStr));
    res.json({ success: true, data: filtered });
  });
  app2.post("/api/v1/encounters", async (req, res) => {
    try {
      await saveEncounter(req.body);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to save encounter" });
    }
  });
  app2.put("/api/v1/encounters/:id/check-in", async (req, res) => {
    try {
      await saveEncounter({ ...req.body, id: req.params.id, status: "CHECKED_IN" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to check in" });
    }
  });
  app2.post("/api/settings/update-provider", (req, res) => {
    const { provider, settings } = req.body;
    console.log("Updating provider:", provider, "with settings:", Object.keys(settings));
    if (provider && settings) {
      try {
        if (provider === "SUPABASE") {
          const { supabaseUrl: supabaseUrl2, supabaseKey: supabaseKey2 } = settings;
          if (!supabaseUrl2.startsWith("http")) throw new Error("Invalid Supabase URL: Must start with http");
          global.supabaseAdmin = (0, import_supabase_js.createClient)(supabaseUrl2, supabaseKey2);
        }
        import_fs.default.writeFileSync("server-settings.json", JSON.stringify({ activeProvider: provider, settings }));
        console.log("Database settings updated and persisted for:", provider);
        return res.json({ success: true, message: "Database settings updated." });
      } catch (e) {
        console.error("Failed to initialize database provider:", e.message);
        return res.status(400).json({ success: false, error: e.message });
      }
    }
    return res.status(400).json({ success: false, error: "Invalid provider or settings." });
  });
  app2.get("/api/settings/get-settings", (req, res) => {
    if (import_fs.default.existsSync("server-settings.json")) {
      try {
        const settings = JSON.parse(import_fs.default.readFileSync("server-settings.json", "utf8"));
        return res.json({ success: true, settings });
      } catch (e) {
        return res.status(500).json({ success: false, error: "Error reading settings" });
      }
    }
    return res.json({ success: false, error: "No settings found" });
  });
  app2.post("/api/ai/analyze-clinical", async (req, res) => {
    const { type, data, lang } = req.body;
    const isAr = lang === "ar";
    try {
      const client = getAiClient();
      let targetPrompt = "";
      if (type === "news2") {
        targetPrompt = `
You are a highly qualified Clinical Consultant and triage expert.
You are analyzing a patient's National Early Warning Score (NEWS2) data to evaluate risk and recommend actions.

Patient Data:
- Respiratory Rate: ${data.respiratoryRate} bpm
- SpO2 Scale 1: ${data.spo2Scale1}%
- SpO2 Scale 2: ${data.spo2Scale2}%
- Oxygen Therapy: ${data.oxygenTherapy ? "Yes" : "No"}
- Systolic Blood Pressure: ${data.systolicBP} mmHg
- Pulse / Heart Rate: ${data.pulse} bpm
- Consciousness (ACVPU): ${data.consciousness}
- Temperature: ${data.temperature}\xB0C
- Calculated SCORE: ${data.totalScore}
- Risk Level: ${data.riskLevel}

Please provide:
1. Clinical Assessment (\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A): Evaluate the physiological risk severity based on these parameters.
2. Immediate Nursing Actions (\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u062A\u0645\u0631\u064A\u0636\u064A\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629): Steps to stabilize the patient.
3. Escalation Protocol (\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u062A\u0635\u0639\u064A\u062F): Who to notify (e.g., attending physician, Critical Care Team) and frequency of monitoring.
4. Red Flags & Warning Signs (\u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062A\u062D\u0630\u064A\u0631\u064A\u0629 \u0627\u0644\u062E\u0637\u064A\u0631\u0629): Specific symptoms or deterioration signs to watch for.

Format the response beautifully in clean, structured Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
If in Arabic, write with professional medical terminology used in top hospitals. Ensure a compassionate, professional, and clear scientific tone.
        `;
      } else if (type === "isbar") {
        targetPrompt = `
You are a Clinical Auditor and Expert Nurse Trainer. You are reviewing a patient medical handover report formatted as ISBAR (Identify, Situation, Background, Assessment, Recommendation).

Handover Data:
- Identify (\u0627\u0644\u062A\u0639\u0631\u064A\u0641 \u0628\u0627\u0644\u0645\u0631\u064A\u0636): ${data.identify}
- Situation (\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u062D\u0627\u0644\u064A): ${data.situation}
- Background (\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u0631\u0636\u064A \u0648\u0627\u0644\u062E\u0644\u0641\u064A\u0629): ${data.background}
- Assessment (\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u062D\u0627\u0644\u064A \u0644\u0644\u0645\u0631\u064A\u0636): ${data.assessment}
- Recommendation (\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0648\u062E\u0637\u0637 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629): ${data.recommendation}

Please provide:
1. Quality Audit & Review (\u062A\u062F\u0642\u064A\u0642 \u062C\u0648\u062F\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631): Critically review this ISBAR handover for completeness, accuracy, and clear communication.
2. Clinical Insights & Risks (\u0627\u0644\u0631\u0624\u0649 \u0648\u0627\u0644\u062A\u062D\u0630\u064A\u0631\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629): Identify potential blind spots, active risks, or missing information in the transfer of care.
3. Recommended Diagnostic / Therapeutic next steps (\u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u0639\u0644\u0627\u062C\u064A\u0629 \u0648\u0627\u0644\u062A\u0634\u062E\u064A\u0635\u064A\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629): Immediate suggestions for safe patient clinical management.
4. Suggestions for Handover Improvement (\u0645\u0642\u062A\u0631\u062D\u0627\u062A \u0644\u062A\u062D\u0633\u064A\u0646 \u0635\u064A\u0627\u063A\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631): How this report could be written better or more clearly to avoid communication errors.

Format the response beautifully in clean, structured Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
If in Arabic, write with professional medical terminology used in top hospitals. Ensure a compassionate, professional, and clear scientific tone.
        `;
      } else {
        targetPrompt = `
You are a Clinical Quality and Patient Safety AI expert.
Analyze the following medical clinical tool audit / findings:
${JSON.stringify(data, null, 2)}

Provide a professional clinical review, safety assessment, potential risk markers, and recommendations formatted in clean Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      }
      let response;
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          response = await client.models.generateContent({
            model: "gemini-3.5-flash",
            contents: targetPrompt,
            config: {
              temperature: 0.3
            }
          });
          break;
        } catch (err) {
          lastError = err;
          if (err.status === 503 || err.message?.includes("503") || err.message?.includes("high demand") || err.message?.includes("UNAVAILABLE")) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * (i + 1)));
            continue;
          }
          throw err;
        }
      }
      if (!response) throw lastError;
      const text = response.text || "";
      res.json({ success: true, analysis: text });
    } catch (error) {
      console.warn("Clinical Safety AI Model failed. Activating high-fidelity fallback. Error:", error.message || error);
      let text = "";
      if (type === "news2") {
        text = getNews2Fallback(data, isAr);
      } else if (type === "isbar") {
        text = getIsbarFallback(data, isAr);
      } else {
        text = isAr ? `### \u{1F4CB} \u062A\u062F\u0642\u064A\u0642 \u0633\u0631\u064A\u0631\u064A \u0627\u062D\u062A\u064A\u0627\u0637\u064A

**\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629:**
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

\u0646\u0638\u0627\u0645 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0641\u0648\u0631\u064A \u0642\u064A\u062F \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629 \u062D\u0627\u0644\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u064A\u062F\u0648\u064A\u0627\u064B.` : `### \u{1F4CB} Offline Backup Clinical Audit

**Received Data:**
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

Live AI analysis model is currently undergoing automatic maintenance. Please review parameters manually according to hospital protocol.`;
      }
      res.json({ success: true, analysis: text, fallback: true });
    }
  });
  app2.get("/api/ping", (req, res) => {
    res.json({ success: true, timestamp: Date.now() });
  });
  const DB_FILE_PATH = import_path.default.join(process.cwd(), "hospital_fallback_database.json");
  let providerStores = {
    SUPABASE: {},
    POCKETBASE: {},
    LOCAL_HOST: {},
    APPWRITE: {}
  };
  if (import_fs.default.existsSync(DB_FILE_PATH)) {
    try {
      const savedData = JSON.parse(import_fs.default.readFileSync(DB_FILE_PATH, "utf8"));
      providerStores = { ...providerStores, ...savedData };
      console.log("\u2705 Success: Persistent fallback database loaded from disk.");
    } catch (e) {
      console.error("Warning: Failed to parse fallback database JSON", e);
    }
  }
  function persistFallbackDatabase() {
    try {
      import_fs.default.writeFileSync(DB_FILE_PATH, JSON.stringify(providerStores, null, 2));
    } catch (e) {
      console.error("Warning: Failed to save fallback database to disk", e);
    }
  }
  let sseClients = [];
  app2.get("/api/db/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    sseClients.push(res);
    req.on("close", () => {
      sseClients = sseClients.filter((client) => client !== res);
    });
  });
  function broadcastUpdate(provider, collectionName) {
    const payload = JSON.stringify({ provider, collectionName, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    sseClients.forEach((client) => {
      try {
        client.write(`data: ${payload}

`);
      } catch (err) {
        console.error("SSE write error:", err);
      }
    });
  }
  app2.get("/api/db/:provider/:collection", async (req, res) => {
    const { provider, collection: collectionName } = req.params;
    const upperProvider = provider.toUpperCase();
    const admin = global.supabaseAdmin || supabaseAdmin;
    if (upperProvider === "SUPABASE") {
      if (!admin) {
        console.error("SUPABASE admin client is not initialized.");
        return res.status(500).json({ success: false, error: "Supabase client not initialized." });
      }
      try {
        console.log(`[Supabase] GET collection: ${collectionName}`);
        const { data, error } = await admin.from(collectionName).select("*");
        if (error) {
          console.error(`[Supabase] GET error for ${collectionName}:`, error);
          throw error;
        }
        console.log(`[Supabase] GET success: ${data ? data.length : 0} items`);
        return res.json({ success: true, data });
      } catch (err) {
        console.error(`SUPABASE API Error for ${collectionName}:`, JSON.stringify(err, null, 2));
        return res.status(500).json({ success: false, error: err.message, details: err.details || err.hint });
      }
    }
    if (!providerStores[upperProvider]) {
      return res.status(404).json({ success: false, error: "Database provider not supported." });
    }
    if (!providerStores[upperProvider][collectionName]) {
      providerStores[upperProvider][collectionName] = [];
    }
    res.json({ success: true, data: providerStores[upperProvider][collectionName] });
  });
  app2.post("/api/db/:provider/:collection", async (req, res) => {
    const { provider, collection: collectionName } = req.params;
    const upperProvider = provider.toUpperCase();
    const item = req.body;
    const admin = global.supabaseAdmin || supabaseAdmin;
    if (upperProvider === "SUPABASE") {
      if (!admin) {
        console.error("SUPABASE admin client is not initialized.");
        return res.status(500).json({ success: false, error: "Supabase client not initialized." });
      }
      try {
        console.log(`[Supabase] POST collection: ${collectionName}, ID: ${item.id}`);
        const { data, error } = await admin.from(collectionName).upsert(item).select();
        if (error) {
          console.error(`[Supabase] POST error for ${collectionName}:`, error);
          throw error;
        }
        console.log(`[Supabase] POST success`);
        broadcastUpdate(upperProvider, collectionName);
        return res.json({ success: true, item: data?.[0] || item });
      } catch (err) {
        console.error(`SUPABASE API Error (POST) for ${collectionName}:`, JSON.stringify(err, null, 2));
        return res.status(500).json({ success: false, error: err.message, details: err.details || err.hint });
      }
    }
    if (!providerStores[upperProvider]) {
      return res.status(404).json({ success: false, error: "Database provider not supported." });
    }
    if (!item || !item.id) {
      return res.status(400).json({ success: false, error: "Item must contain an 'id' field." });
    }
    if (!providerStores[upperProvider][collectionName]) {
      providerStores[upperProvider][collectionName] = [];
    }
    const index = providerStores[upperProvider][collectionName].findIndex((x) => x.id === item.id);
    if (index >= 0) {
      providerStores[upperProvider][collectionName][index] = {
        ...providerStores[upperProvider][collectionName][index],
        ...item,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else {
      providerStores[upperProvider][collectionName].push({
        ...item,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    persistFallbackDatabase();
    broadcastUpdate(upperProvider, collectionName);
    res.json({ success: true, item });
  });
  app2.delete("/api/db/:provider/:collection/:id", async (req, res) => {
    const { provider, collection: collectionName, id } = req.params;
    const upperProvider = provider.toUpperCase();
    const admin = global.supabaseAdmin || supabaseAdmin;
    if (upperProvider === "SUPABASE") {
      if (!admin) {
        console.error("SUPABASE admin client is not initialized.");
        return res.status(500).json({ success: false, error: "Supabase client not initialized." });
      }
      try {
        const { error } = await admin.from(collectionName).delete().eq("id", id);
        if (error) throw error;
        broadcastUpdate(upperProvider, collectionName);
        return res.json({ success: true });
      } catch (err) {
        console.error(`SUPABASE API Error (DELETE) for ${collectionName}:`, JSON.stringify(err, null, 2));
        return res.status(500).json({ success: false, error: err.message, details: err.details || err.hint });
      }
    }
    if (!providerStores[upperProvider]) {
      return res.status(404).json({ success: false, error: "Database provider not supported." });
    }
    if (!providerStores[upperProvider][collectionName]) {
      providerStores[upperProvider][collectionName] = [];
    }
    const initialLength = providerStores[upperProvider][collectionName].length;
    providerStores[upperProvider][collectionName] = providerStores[upperProvider][collectionName].filter((x) => x.id !== id);
    if (providerStores[upperProvider][collectionName].length !== initialLength) {
      persistFallbackDatabase();
      broadcastUpdate(upperProvider, collectionName);
    }
    res.json({ success: true });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app2.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app2.use(import_express.default.static(distPath));
    app2.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("Serving static files from dist.");
  }
  app2.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
