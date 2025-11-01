document.addEventListener("DOMContentLoaded", () => {
    const answerForm = document.getElementById("answer-form");
    const answerInput = document.getElementById("answer-input");
    const submitButton = document.getElementById("submit-button");
    const feedbackDiv = document.getElementById("feedback-message");
    const attemptStatus = document.getElementById("attempt-status");
    const assignmentText = document.getElementById("assignment-text");
    const nextLevelButton = document.getElementById("next-level-button");

    let assignedImage = 0;
    let triesUsed = 0;
    const maxTries = 10;

    // --- Initialize Challenge ---
    function initializeChallenge() {
        assignedImage = Math.floor(Math.random() * 50) + 1;
        triesUsed = 0;

        // ✅ Ensure assignment text updates every time
        assignmentText.innerHTML = `🎲 Your team has been assigned: <strong>wv_${assignedImage}.png</strong>`;
        feedbackDiv.textContent = "";
        feedbackDiv.className = "";
        updateAttemptStatus();

        // Reset inputs and buttons
        answerInput.disabled = false;
        submitButton.disabled = false;
        submitButton.textContent = "Submit Answer";
        nextLevelButton.style.display = "none";
    }

    function updateAttemptStatus() {
        attemptStatus.textContent = `Attempts: ${triesUsed} / ${maxTries}`;
    }

    function showFeedback(message, type) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = type === 'correct' ? 'feedback-correct' : 'feedback-incorrect';
    }

    function endGame(message, isSuccess) {
        answerInput.disabled = true;
        submitButton.disabled = true;
        showFeedback(message, isSuccess ? 'correct' : 'incorrect');

        // ✅ Show Next Level button on success
        if (isSuccess) {
            nextLevelButton.style.display = "inline-block";
        }
    }

    async function checkAnswerWithBackend(imageNo, submittedAnswer, tries) {
        const response = await fetch('/api/check-answer', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                image_no: imageNo,
                submitted: submittedAnswer,
                tries_used: tries
            })
        });
        return await response.json();
    }

    answerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const teamAnswer = answerInput.value.trim().toUpperCase();
        if (!teamAnswer) return;

        triesUsed++;
        updateAttemptStatus();

        submitButton.disabled = true;
        submitButton.textContent = "Checking...";

        try {
            const result = await checkAnswerWithBackend(assignedImage, teamAnswer, triesUsed);

            if (result.correct) {
                endGame(result.message, true);
            } else {
                if (triesUsed >= maxTries) {
                    endGame(result.message, false);
                } else {
                    showFeedback(result.message, 'incorrect');
                }
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            showFeedback("⚠️ Server connection error. Try again.", "incorrect");
        } finally {
            if (triesUsed < maxTries && !answerInput.disabled) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Answer";
            }
            answerInput.value = "";
        }
    });

    // ✅ Handle next level click
    nextLevelButton.addEventListener("click", () => {
        initializeChallenge();
    });

    // Start challenge
    initializeChallenge();
});
