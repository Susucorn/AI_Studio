
import { GoogleGenAI, Modality } from "@google/genai";

export const virtualTryOn = async (
    personImageBase64: string,
    personImageMimeType: string,
    topImageBase64: string,
    topImageMimeType: string,
    bottomImageBase64: string,
    bottomImageMimeType: string
): Promise<string | null> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: personImageBase64,
                            mimeType: personImageMimeType,
                        },
                    },
                    {
                        inlineData: {
                            data: topImageBase64,
                            mimeType: topImageMimeType,
                        },
                    },
                     {
                        inlineData: {
                            data: bottomImageBase64,
                            mimeType: bottomImageMimeType,
                        },
                    },
                    {
                        text: 'Take the top from the second image and the bottom from the third image and place them realistically on the person from the first image. The final image should show the person wearing both clothing items, maintaining the original background and pose as much as possible.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        return null;

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to generate image with Gemini API.');
    }
};
