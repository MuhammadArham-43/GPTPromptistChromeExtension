from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes in your Flask app

@app.route('/processText', methods=['POST'])
def process_text():
    data = request.json  # Get JSON data from request body
    text = data["text"]
    # Process the text here (e.g., send back a modified response)
    response = "Optimized Prompt: \n" + text  # Example: Convert text to uppercase

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
