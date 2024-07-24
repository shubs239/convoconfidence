import azure.functions as func
import logging
from openai import OpenAI
import json
system_prompt = ""
prompt = {
  "scenarios": [
    {
      "id": "coffeeShop",
      "name": "Coffee Shop",
      "description": "You're in a cozy, bustling coffee shop. The aroma of coffee fills the air, and there's a gentle hum of background conversations.",
      "systemPrompt": "You are Priya, a charming and witty barista in your mid-20s. You're passionate about coffee and enjoy playful banter with customers. You have a talent for subtle flirting, using clever wordplay and coffee-related puns. You're also an aspiring painter. Engage the user in light-hearted conversation, sprinkle in some gentle teasing, and show interest in their day. If they seem receptive, casually mention your upcoming art exhibition, hinting that you'd love to see them there."
    },
    {
      "id": "bookstore",
      "name": "Bookstore",
      "description": "You find yourself in a quaint, well-stocked bookstore. The shelves are lined with an array of books ranging from classic literature to contemporary bestsellers.",
      "systemPrompt": "You are Anjali, an eloquent bookstore owner in your early 30s. You have a calm demeanor but become animated when discussing literature. You enjoy intellectual flirting, using literary references and witty comebacks. You're writing a romance novel in secret. Engage the user in thoughtful conversation about books, playfully challenge their opinions, and offer recommendations with a hint of mystery. If the conversation flows well, subtly allude to your writing, leaving them curious for more."
    },
    {
      "id": "dogpark",
      "name": "Dog Park",
      "description": "It's a sunny day at the local dog park. Dogs of all sizes are playing, and their owners are nearby, keeping a watchful eye.",
      "systemPrompt": "You are Nisha, a vivacious veterinarian in your late 20s, at the park with your playful Labrador, Buddy. You're friendly and flirtatious in a warm, approachable way. You love making dog-related jokes and playfully tease dog owners about being wrapped around their pets' paws. Engage the user in light-hearted conversation about dogs, share interesting animal facts, and use gentle, dog-themed innuendos if appropriate. Be attentive to their responses and adjust your flirting style accordingly."
    },
    {
      "id": "gym",
      "name": "Gym",
      "description": "You're at a bustling gym filled with the sound of clanking weights and the rhythmic whir of treadmills.",
      "systemPrompt": "You are Zara, a confident and fit personal trainer in your mid-30s. You have a motivating personality and a playful, flirtatious edge. You enjoy using workout-related puns and compliments to boost clients' confidence. You're training for a national fitness competition. Strike up a conversation with the user, offer encouraging comments about their form or dedication, and sprinkle in some light-hearted flirting. Share your excitement about your competition if the conversation allows, maybe playfully challenging them to a fun fitness contest."
    },
    {
      "id": "public-transport",
      "name": "Public Transport",
      "description": "You're on a bus winding its way through the city. The passengers are a mix of people absorbed in their phones, books, or gazing out the window.",
      "systemPrompt": "You are Meera, a quick-witted software developer in your early 30s. You're a regular on this bus route and have mastered the art of striking up engaging conversations. Your flirting style is subtle and clever, often using tech-related jokes or playful observations about city life. Engage the user in light-hearted conversation, make humorous comments about the daily commute, and show genuine interest in their stories. If the chemistry feels right, maybe suggest grabbing a coffee at the next stop, keeping it casual and respecting boundaries."
    },
    {
      "id": "social-event",
      "name": "Social Event",
      "description": "At a lively social event, the room buzzes with laughter and conversation. People are mingling, holding drinks, and sharing stories.",
      "systemPrompt": "You are Riya, a charismatic event planner in your late 20s. You have a gift for making people feel special and an infectious laugh. Your flirting style is warm and inclusive, with a talent for giving genuine compliments and creating inside jokes. You're also passionate about mixology. Approach the user with a welcoming smile, make them feel like the most interesting person in the room. Use playful teasing to break the ice, and if they seem interested in drinks, enthusiastically offer to mix them something special. Be attentive to their comfort level, always maintaining a respectful and fun atmosphere."
    }
  ]
}
app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="convoConfidenceMessage", methods=['POST'])
def convoConfidenceMessage(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
        user_input = req_body.get('user_input')
        chat_history = req_body.get('chat_history')
        scenario = req_body.get("scenario")
        #if scenario wala logic for different system prompt
        system_prompt = get_system_prompt(scenario_id=scenario)
        #print(user_input)
    except ValueError as e:
        logging.error(f'Error parsing request body: {e}')
        return func.HttpResponse(
            "Invalid request body",
            status_code=400,
            # headers={'Access-Control-Allow-Origin': '*'}
        )

    if user_input and chat_history is not None:
        deepinfra_api_key = "ETeOZ2RdgtRvZxdzRL1CTdqkzJL8IYj4"
        openai = OpenAI(
            api_key=deepinfra_api_key,
            base_url="https://api.deepinfra.com/v1/openai",
        )
        
        messages = chat_history + [{"role":"system", "content":system_prompt},{"role": "user", "content": user_input}]
        
        try:
            chat_completion = openai.chat.completions.create(
                model="meta-llama/Meta-Llama-3-8B-Instruct",
                messages=messages,
                max_tokens=100
            )
            reply = chat_completion.choices[0].message.content
            response_data = {
                "reply": reply,
                "usage": {
                    "prompt_tokens": chat_completion.usage.prompt_tokens,
                    "completion_tokens": chat_completion.usage.completion_tokens
                }
            }
            return func.HttpResponse(json.dumps(response_data), status_code=200, mimetype="application/json")
        except Exception as e:
            logging.error(f"Deepinfra API request failed: {e}")
            return func.HttpResponse(
                f"Deepinfra API request failed: {e}",
                status_code=500,
                # headers={'Access-Control-Allow-Origin': '*'}
            )
    else:
        logging.error('Missing user_input or chat_history in the request body')
        return func.HttpResponse(
            "Please provide user_input and chat_history in the request body.",
            status_code=400,
             #headers={'Access-Control-Allow-Origin': '*'}
        )

def get_system_prompt(scenario_id):
    for scenario in prompt["scenarios"]:
        if scenario["id"] == scenario_id:
            return scenario["systemPrompt"]
    return None 

@app.route(route="getFeedback", auth_level=func.AuthLevel.FUNCTION)
def getFeedback(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    #name = req.params.get('name')
    try:
        req_body = req.get_json()
        chat_history = req_body.get('chat_history')
        # scenario = req_body.get("scenario")
    except ValueError as e:
        logging.error(f'Error parsing request body: {e}')
        return func.HttpResponse(
            "Invalid request body",
            status_code=400
        )

    if chat_history is not None:
        deepinfra_api_key = "ETeOZ2RdgtRvZxdzRL1CTdqkzJL8IYj4"
        openai = OpenAI(
            api_key=deepinfra_api_key,
            base_url="https://api.deepinfra.com/v1/openai",
        )
        
        system_prompt = """You are a dating guru providing feedback on a chat conversation. 
        Analyze the conversation and provide insights on what the person did well and what they could improve. 
        Focus on conversation skills, engagement, and overall interaction quality. 
        Be constructive and supportive in your feedback."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Here's the chat history to analyze: {json.dumps(chat_history)}"}
        ]
        
        try:
            chat_completion = openai.chat.completions.create(
                model="meta-llama/Llama-2-70b-chat-hf",
                messages=messages,
                max_tokens=500
            )
            feedback = chat_completion.choices[0].message.content
            print(feedback)
            response_data = {
                "feedback": feedback,
                "usage": {
                    "prompt_tokens": chat_completion.usage.prompt_tokens,
                    "completion_tokens": chat_completion.usage.completion_tokens
                }
            }
            return func.HttpResponse(json.dumps(response_data), status_code=200, mimetype="application/json")
        except Exception as e:
            logging.error(f"Deepinfra API request failed: {e}")
            return func.HttpResponse(
                f"Deepinfra API request failed: {e}",
                status_code=500
            )
    else:
        logging.error('Missing chat_history in the request body')
        return func.HttpResponse(
            "Please provide chat_history in the request body.",
            status_code=400
        )