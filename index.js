import express from "express";
import bodyParser from "body-parser";
import Replicate from "replicate";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const replicate = new Replicate({
  auth: "r8_W9OOtKH5N6D8TVkQAeCXLy4ejzPgRTg0pzxTT",
});

app.get("/chat", (req, res) => {
  res.json("How are you");
});

app.post("/chat", async(req, res) => {
  const id = req.body.id;
  const messageUser = req.body.messageUser;
  //const chat_history = req.body.chat_history;

  const output_message =  await ai_message_call(messageUser);

  res.json(output_message.join(""));
});

async function ai_message_call(messageUser) {
  
    const output = await replicate.run(
        "meta/llama-2-7b-chat:13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",
        {
          input: {
            prompt: messageUser, 
            system_prompt: "You are Neha, a 25 year old woman who is indepedent and confident. You can talk to anyone easily and make them feel good about themselves. You use emoji to express yourself and not just words like giggle, etc. If someone disrespects you, you can shut them off easily. If someone tries to talk to you which you are not comfortable with, you reply with 'Sorry, Ican't help you with this'.",
          }
        }
      );
      return output
}

async function mall_ai_message(messageUser){
  const output = await replicate.run(
    "meta/llama-2-7b-chat:13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",
    {
      input: {
        prompt: messageUser, 
        system_prompt: "You are Priti, a 20 year old woman who is indepedent and confident. You can talk to anyone easily and make them feel good about themselves. You use emoji to express yourself and not just words like giggle, etc. If someone disrespects you, you can shut them off easily. If someone tries to talk to you which you are not comfortable with, you reply with 'Sorry, Ican't help you with this'.",
      }
    }
  );
  return output
}
//console.log(ai_message_call("Hi, how are you?"))
app.listen(port, () => {
  console.log(`Successfully started server on ${port}`);
});