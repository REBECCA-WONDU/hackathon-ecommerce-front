const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");

const TOKEN = "7785621571:AAFVIOVkRQtbHR7LtEt3iyvvE5tjCXcZWc8"; // Replace with your bot token
const bot = new Telegraf(TOKEN);

const web_link = "https://hackathon-ecommerce-front.vercel.app/";
const dataFilePath = path.join(__dirname, "formData.json");

// Helper function to save data to a JSON file
function saveDataToJson(userData) {
  try {
    let existingData = [];

    // Check if the file exists and read existing data
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8");
      existingData = JSON.parse(fileContent);
    }

    // Add new user data
    existingData.push(userData);

    // Write updated data back to the file
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(existingData, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Error saving data to JSON file:", error);
  }
}

// Define the messages for different languages
const messages = {
  en: {
    welcome: "Welcome! Are you a Buyer or a Seller?",
    buyerRedirect: "Redirecting you to the e-commerce website...",
    seller: "Please enter your Telegram channel (e.g., @channelname):",
    fullName: "Please enter your full name:",
    phone: "Enter your phone number:",
    address: "Enter your address:",
    item: "What item do you want to sell?",
    photo: "Upload a picture of the item (mandatory):",
    price: "Enter the price you are offering:",
    details: "Provide additional details about the item:",
    summary: "Thank you! Here is the summary of your details:\n\n",
    redirect: "Redirecting you to the e-commerce website...",
    finalNote: "✅ Your information has been saved successfully!",
    success: "✅ Your information has been saved successfully!",
  },
  // Add translations for am and om as needed...
};

// User state to track progress
const userState = {};

// Language selection
bot.start((ctx) => {
  ctx.reply("Please select your language:", {
    reply_markup: {
      keyboard: [
        [{ text: "English" }, { text: "አማርኛ" }, { text: "Afan Oromo" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

// Set language based on user selection
bot.hears(["English", "አማርኛ", "Afan Oromo"], async (ctx) => {
  const lang =
    ctx.message.text === "English"
      ? "en"
      : ctx.message.text === "አማርኛ"
      ? "am"
      : "om";
  const userId = ctx.from.id;

  userState[userId] = userState[userId] || {}; // Ensure user state exists
  userState[userId].lang = lang;
  userState[userId].step = "roleSelection"; // Set initial state

  await ctx.reply(messages[lang].welcome, {
    reply_markup: {
      keyboard: [[{ text: "Buyer" }, { text: "Seller" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

// Handle Buyer flow (redirect to the website)
// Handle Seller flow// Handle Seller flow
bot.hears("Seller", async (ctx) => {
  const userId = ctx.from.id;
  const lang = userState[userId]?.lang;

  if (!lang) return; // Ensure the language is set before proceeding

  userState[userId].step = "telegramChannel"; // Start with Telegram channel step
  await ctx.reply(messages[lang].seller);
});

// Handle all text messages (steps)
bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const lang = userState[userId]?.lang;

  if (!userState[userId] || !lang) return;

  const currentStep = userState[userId].step;

  if (currentStep === "telegramChannel") {
    userState[userId].telegramChannel = ctx.message.text;
    userState[userId].step = "fullName";
    await ctx.reply(messages[lang].fullName);
  } else if (currentStep === "fullName") {
    userState[userId].fullName = ctx.message.text;
    userState[userId].step = "phone";
    await ctx.reply(messages[lang].phone);
  } else if (currentStep === "phone") {
    userState[userId].phoneNumber = ctx.message.text;
    userState[userId].step = "address";
    await ctx.reply(messages[lang].address);
  } else if (currentStep === "address") {
    userState[userId].address = ctx.message.text;
    userState[userId].step = "item";
    await ctx.reply(messages[lang].item);
  } else if (currentStep === "item") {
    userState[userId].item = ctx.message.text;
    userState[userId].step = "price";
    await ctx.reply(messages[lang].price);
  } else if (currentStep === "price") {
    userState[userId].price = ctx.message.text;
    userState[userId].step = "photo";
    await ctx.reply(messages[lang].photo);
  } else if (currentStep === "details") {
    userState[userId].details = ctx.message.text;
    userState[userId].step = null; // Mark as complete

    // Generate summarized post
    const summary = `
📢 **New Item for Sale** 📢
👤 **Name**: ${userState[userId].fullName}
📱 **Contact**: ${userState[userId].phoneNumber}
📍 **Address**: ${userState[userId].address}
🛒 **Item**: ${userState[userId].item}
💰 **Price**: ${userState[userId].price}
📄 **Details**: ${userState[userId].details}
    `;

    // Send the summary along with the photo
    if (userState[userId].photo) {
      await ctx.replyWithPhoto(userState[userId].photo, {
        caption: summary,
        parse_mode: "Markdown",
      });
    } else {
      await ctx.reply(summary, { parse_mode: "Markdown" });
    }

    // Optional: Additional note to seller
    await ctx.reply(messages[lang].finalNote);
  }
});

// Handle photo uploads
bot.on("photo", async (ctx) => {
  const userId = ctx.from.id;
  const lang = userState[userId]?.lang;

  if (!userState[userId] || !lang) return;

  const currentStep = userState[userId].step;

  if (currentStep === "photo") {
    const photoFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id; // Get highest resolution
    userState[userId].photo = photoFileId;
    userState[userId].step = "details";

    await ctx.reply(messages[lang].details);
  }
});



bot.launch();
