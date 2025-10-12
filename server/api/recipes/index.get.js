import prisma from '../../utils/prisma'
import { getServerSession } from '#auth'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // const session = await getServerSession(event)
  // if (!session) {
  //     throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  // }

  const query = getQuery(event)
  const authorId = query.authorId
  const publicRecipes = query.isPublic
  // vérif authorId est celui du user courant, si oui ok, si non, vérifie sir admin et sinon mettre un message d'erreur
  // ou ajout de filtre après la requête qui correspond à ceux dont le user a le droit, si pas admin, on met que les recettes publiques de l'authorId demandé

  const recipes = await prisma.recipe.findMany({
    where: {
      ...(authorId ? { authorId } : {}),
      ...(publicRecipes !== undefined
        ? { isPublic: Boolean(publicRecipes) }
        : {})
    }
  })

  return recipes
})
