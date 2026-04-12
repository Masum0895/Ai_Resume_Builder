// server/controllers/aiController.js
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Generate professional summary
export const generateSummary = async (req, res) => {
    try {
        const { userInfo, jobDescription } = req.body;
        
        const prompt = `
            You are a professional resume writer. Based on the following information, 
            write a compelling professional summary for a resume.
            
            User's profession: ${userInfo.profession || 'Professional'}
            User's experience: ${userInfo.experience || 'Not provided'}
            Job description (if available): ${jobDescription || 'General position'}
            
            Requirements:
            - Keep it under 150 words
            - Be professional and impactful
            - Highlight key strengths
            - Use active voice
        `;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or "gpt-4" for better quality
            messages: [
                { role: "system", content: "You are an expert resume writer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });
        
        const summary = completion.choices[0].message.content;
        
        res.json({ success: true, summary });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Enhance job description bullet points
export const enhanceBulletPoints = async (req, res) => {
    try {
        const { bulletPoints, jobTitle } = req.body;
        
        const prompt = `
            Rewrite these resume bullet points to be more impactful and results-driven:
            
            ${bulletPoints.join('\n')}
            
            Job Title: ${jobTitle}
            
            Make them:
            - Start with strong action verbs
            - Include quantifiable achievements where possible
            - Be concise and professional
        `;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert at writing resume bullet points." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 500,
        });
        
        const enhanced = completion.choices[0].message.content;
        
        res.json({ success: true, enhanced });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tailor resume for specific job
export const tailorResume = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        
        const prompt = `
            Tailor this resume for the following job description.
            
            CURRENT RESUME:
            Summary: ${resumeData.professional_summary}
            Skills: ${resumeData.skills?.join(', ')}
            Experience: ${JSON.stringify(resumeData.experience)}
            
            JOB DESCRIPTION:
            ${jobDescription}
            
            Provide:
            1. Optimized professional summary
            2. Key skills to highlight
            3. Suggested rewrites for experience section
        `;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4", // Use GPT-4 for complex tailoring
            messages: [
                { role: "system", content: "You are a resume tailoring expert specializing in ATS optimization." },
                { role: "user", content: prompt }
            ],
            temperature: 0.6,
            max_tokens: 1000,
        });
        
        const tailored = completion.choices[0].message.content;
        
        res.json({ success: true, tailored });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};