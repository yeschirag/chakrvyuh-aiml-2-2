from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

answers = {
    1: "ODROM", 2: "KRATS", 3: "ADNAW", 4: "NOISIV", 5: "AHTAGA",
    6: "ACIREMA", 7: "EGNARTS", 8: "SONAHT", 9: "IKOL", 10: "YADIRF",
    11: "NORTLU", 12: "SIVRAJ", 13: "GNOW", 14: "IRUHS", 15: "RETEP",
    16: "CITSYM", 17: "SOAHC", 18: "YTILAER", 19: "NOISULLI", 20: "XEH",
    21: "HCTILG", 22: "CIGAM", 23: "HTURT", 24: "RORRIM", 25: "EMIT",
    26: "ECAPS", 27: "LUOS", 28: "REWOP", 29: "DNIM", 30: "YTINIFNI",
    31: "ESREVITLUM", 32: "LATROP", 33: "MAERD", 34: "LORTNOC", 35: "HCTIW",
    36: "ESRUC", 37: "TERCES", 38: "THGIL", 39: "SSENKRAD", 40: "YGRENE",
    41: "MUINARBIV", 42: "WEIVTSEW", 43: "YNITSED", 44: "YROMEM",
    45: "ERUTCARF", 46: "CITOAHC", 47: "XODARAP", 48: "LANGIS",
    49: "NROBER", 50: "XEDOC"
}


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/check-answer', methods=['POST'])
def check_answer_api():
    data = request.json
    image_no = data.get('image_no')
    submitted_ans = data.get('submitted', '').strip().upper()
    tries_used = data.get('tries_used')

    correct_ans = answers.get(image_no)

    if not correct_ans:
        return jsonify({"error": f"Image number {image_no} not found!"}), 404

    if submitted_ans == correct_ans:
        return jsonify({
            "correct": True,
            "message": f"🎉 Congratulations! You solved it in {tries_used} attempt(s)!"
        })
    elif tries_used >= 10:
        return jsonify({
            "correct": False,
            "message": f"❌ Game Over! The correct answer was {correct_ans}.",
            "reveal": correct_ans
        })
    else:
        return jsonify({
            "correct": False,
            "message": "❌ Incorrect answer! Try again."
        })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
    app.run(debug=True)
