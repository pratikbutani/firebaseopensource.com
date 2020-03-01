// @ts-ignore
import { queryFirestore } from 'firewings' // TODO: Add typings
import { Env } from '~/../shared/types'
import { Util } from '~/../shared/util'

let fireStore: firebase.firestore.Firestore

export const _setupFirestore = (firestore: firebase.firestore.Firestore) => {
  fireStore = firestore
}

const ALL_CATEGORIES = [
  {
    title: 'Android',
    icon: 'android',
    platform: 'android',
    projects: [],
    featured: []
  },
  {
    title: 'Web',
    icon: 'web',
    platform: 'web',
    projects: [],
    featured: []
  },
  {
    title: 'iOS',
    icon: 'phone_android',
    platform: 'ios',
    projects: [],
    featured: []
  },
  {
    title: 'Admin',
    icon: 'lock',
    platform: 'admin',
    projects: [],
    featured: []
  },
  {
    title: 'Games',
    icon: 'gamepad',
    platform: 'games',
    projects: [],
    featured: []
  }
]

export async function getProjectConfig (id: string, env: Env) {
  const path = Util.configPath(id, env)
  const ref = fireStore.doc(path)
  try {
    return await queryFirestore(ref)
  } catch (e) {
    Promise.reject(e)
  }
}

export async function getProjectContent (id: string, env: Env) {
  const path = Util.contentPath(id, env)
  const ref = fireStore.doc(path)
  try {
    return await queryFirestore(ref)
  } catch (e) {
    Promise.reject(e)
  }
}

export async function getProjectConfigs (category: Category, limit: number) {
  const ref = fireStore.collection('configs').orderBy(`platforms.${category.platform}`)
    .where('blacklist', '==', false)
    .where('fork', '==', false)
    .orderBy('stars', 'desc')
    .orderBy('description')
    .limit(limit)
  try {
    return await queryFirestore(ref)
  } catch (e) {
    Promise.reject(e)
  }
}

export async function getSubpage (id: string, env: Env, pageId: string) {
  const repoContentRef = fireStore.doc(Util.contentPath(id, env))
  if (!pageId.endsWith('.md')) {
    pageId += '.md'
  }
  const pageContentRef = repoContentRef.collection('pages').doc(pageId)
  try {
    return await queryFirestore(pageContentRef)
  } catch (e) {
    Promise.reject(e)
  }
}

export async function getRecentReleases (amount: number) {
  const ref = fireStore.collection('releases').orderBy('created_at', 'desc')
    .limit(amount)
  try {
    return await queryFirestore(ref)
  } catch (e) {
    Promise.reject(e)
  }
}

export function getCategories (platform: String | null = null): Category[] {
  if (platform) {
    return [ALL_CATEGORIES.find(x => x.platform === platform)!]
  }
  return ALL_CATEGORIES
}