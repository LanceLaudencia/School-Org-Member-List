import { ref as firebaseRef, onValue } from 'firebase/database'
import { db } from '../firebase/config'
import type { Member } from '../types/Member'
import { ref } from 'vue'


export const useMembers = () => {

  const members = ref<Member[]>([])

  const loading = ref(true)

  const membersRef = firebaseRef(
    db,
    'members'
  )


  onValue(
    membersRef,
    (snapshot) => {

      const data = snapshot.val()

      if (data) {

        members.value = Object.keys(data).map(
          (key) => ({
            id: key,
            ...data[key]
          })
        )

      } else {

        members.value = []

      }

      loading.value = false

    }
  )


  return {
    members,
    loading
  }

}