import prisma from "../../utils/prisma";
import { z } from "zod";

const registerRecipesSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  ingredients: z.array(z.string().min(2)).min(1),
  instructions: z.array(z.string().min(2)).min(1),
});

export default defineEventHandler(async (request) => {
  const body = await readBody(request);

  const parsed = registerRecipesSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(", "),
    });
  }

  const { title, description, ingredients, instructions } = parsed.data;

  const newRecipe = await prisma.recipe.create({
    data: {
      title,
      description,
      ingredients,
      instructions,
      authorId: 3
    }
  });

  return newRecipe;
});
