import { db } from '../firebase/config'

import {
  ref,
  push,
  set,
  update,
  remove
} from 'firebase/database'

import type { Member } from '../types/Member'


// ADD MEMBER
export const addMember = async (
  member: Member
) => {

  const membersRef = ref(db, 'members')

  const newMemberRef = push(membersRef)

  await set(newMemberRef, {
    memberId: member.memberId,
    name: member.name,
    course: member.course,
    yearLevel: member.yearLevel,
    position: member.position,
    contact: member.contact
  })

}


// UPDATE MEMBER
export const updateMember = async (
  id: string,
  member: Member
) => {

  const memberRef = ref(
    db,
    `members/${id}`
  )

  await update(memberRef, {
    memberId: member.memberId,
    name: member.name,
    course: member.course,
    yearLevel: member.yearLevel,
    position: member.position,
    contact: member.contact
  })

}


// DELETE MEMBER
export const deleteMember = async (
  id: string
) => {

  const memberRef = ref(
    db,
    `members/${id}`
  )

  await remove(memberRef)

}