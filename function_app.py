import azure.functions as func
import logging
from openai import OpenAI
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="convoConfidenceMessage", methods=['POST'])
def convoConfidenceMessage(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
        user_input = req_body.get('user_input')
        chat_history = req_body.get('chat_history')
        #scenario = req_body.get("scenario")
        print(user_input)
    except ValueError as e:
        logging.error(f'Error parsing request body: {e}')
        return func.HttpResponse(
            "Invalid request body",
            status_code=400,
            # headers={'Access-Control-Allow-Origin': '*'}
        )

    if user_input and chat_history is not None:
        # deepinfra_api_key = "ETeOZ2RdgtRvZxdzRL1CTdqkzJL8IYj4"
        # openai = OpenAI(
        #     api_key=deepinfra_api_key,
        #     base_url="https://api.deepinfra.com/v1/openai",
        # )
        
        messages = chat_history + [{"role":"system", "content":"You are Pooja, drinking coffee while reading a book"},{"role": "user", "content": user_input}]
        
        try:
            # chat_completion = openai.chat.completions.create(
            #     model="meta-llama/Meta-Llama-3-8B-Instruct",
            #     messages=messages,
            #     max_tokens=50
            # )
            #reply = chat_completion.choices[0].message.content
            response_data = {
                "reply": "reply",
                "usage": {
                    "prompt_tokens": 10,#chat_completion.usage.prompt_tokens,
                    "completion_tokens": 10#chat_completion.usage.completion_tokens
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
