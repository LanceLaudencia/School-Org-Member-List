<template>    
  <ion-page>    
    <ion-header>    
      <ion-toolbar>    
        <ion-buttons slot="start">    
          <ion-back-button default-href="/" />    
        </ion-buttons>    
    
        <ion-title>    
          <ion-icon :icon="peopleOutline" />    
          Members    
        </ion-title>    
    
        <ion-buttons slot="end">    
          <ion-button @click="goToAdd">    
            <ion-icon :icon="personAddOutline" />    
          </ion-button>    
        </ion-buttons>    
      </ion-toolbar>    
    </ion-header>    
    
    <ion-content>    
      <div class="list-container">    
    
        <div class="page-header">    
          <div>    
            <h1>Organization Members</h1>    
            <p>{{ members.length }} registered member(s)</p>    
          </div>    
    
          <div class="count-box">    
            <ion-icon :icon="peopleCircleOutline" />    
            {{ members.length }}    
          </div>    
        </div>    
    
        <ion-searchbar   
          v-model="search"   
          placeholder="Search members"   
          :debounce="200"   
          class="search"   
        />    

        <div v-if="members.length > 0" class="select-actions">
          <ion-button fill="outline" @click="selectAll">
            Select All
          </ion-button>

          <ion-button fill="outline" @click="deselectAll">
            Deselect All
          </ion-button>

          <ion-button
            class="delete-selected"
            :disabled="selectedIds.length === 0"
            @click="deleteSelected"
          >
            Delete Selected ({{ selectedIds.length }})
          </ion-button>
        </div>
    
        <div v-if="filteredMembers.length === 0" class="empty-card">    
          <ion-icon :icon="peopleCircleOutline" />    
          <h2>No Members Found</h2>    
          <p>Add a member to your organization list.</p>    
        </div>    
    
        <div   
          v-for="member in filteredMembers"   
          :key="member.id"   
          class="member-card"   
        >    
          <div class="member-top">    
            <ion-checkbox
              :checked="selectedIds.includes(member.id!)"
              @ionChange="toggleSelect(member.id!)"
            />

            <div class="avatar">    
              <ion-icon :icon="personOutline" />    
            </div>    
    
            <div class="member-name">    
              <h2>{{ member.name }}</h2>    
              <span>{{ member.position }}</span>    
            </div>    
          </div>    
    
          <div class="member-info">    
            <div class="info">    
              <ion-icon :icon="cardOutline" />    
              <div><small>Member ID</small><strong>{{ member.memberId }}</strong></div>    
            </div>    
    
            <div class="info">    
              <ion-icon :icon="schoolOutline" />    
              <div><small>Course</small><strong>{{ member.course }}</strong></div>    
            </div>    
    
            <div class="info">    
              <ion-icon :icon="calendarOutline" />    
              <div><small>Year Level</small><strong>{{ member.yearLevel }}</strong></div>    
            </div>    
    
            <div class="info">    
              <ion-icon :icon="callOutline" />    
              <div><small>Contact</small><strong>{{ member.contact }}</strong></div>    
            </div>    
          </div>    
    
          <div class="actions">    
            <ion-button fill="outline" class="edit-button" @click="editMember(member.id!)">    
              <ion-icon :icon="createOutline" slot="start" />    
              Edit    
            </ion-button>    
    
            <ion-button class="delete-button" @click="removeMember(member.id!)">    
              <ion-icon :icon="trashOutline" slot="start" />    
              Delete    
            </ion-button>    
          </div>    
        </div>    
    
        <ion-button expand="block" class="add-button" @click="goToAdd">    
          <ion-icon :icon="personAddOutline" slot="start" />    
          Add Member    
        </ion-button>    
    
      </div>    
    </ion-content>    
  </ion-page>    
</template>    
    
<script setup lang="ts">    
import { computed, ref } from 'vue' // Vue functions
import { onIonViewWillEnter } from '@ionic/vue' // Runs when page opens
import { useRouter } from 'vue-router' // Page navigation
import {    
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,    
  IonButtons, IonBackButton, IonButton, IonIcon, IonSearchbar, IonCheckbox
} from '@ionic/vue' // Ionic components
import {    
  peopleOutline, peopleCircleOutline, personAddOutline, personOutline,    
  cardOutline, schoolOutline, calendarOutline, callOutline,    
  createOutline, trashOutline    
} from 'ionicons/icons' // Icons
import { ref as firebaseRef, get } from 'firebase/database' // Get Firebase data
import { db } from '../firebase/config' // Firebase database
import { deleteMember } from '../services/memberService' // Delete member
import type { Member } from '../types/Member' // Member data type
    
const router = useRouter() // Creates page navigation
const members = ref<Member[]>([]) // Stores members
const search = ref('') // Stores search text
const selectedIds = ref<string[]>([]) // Stores selected members
    
const loadMembers = async () => { // Loads members from Firebase
  try {    
    const snapshot = await get(firebaseRef(db, 'members'))    
    
    if (!snapshot.exists()) {    
      members.value = []    
      selectedIds.value = []
      return    
    }    
    
    members.value = Object.entries(snapshot.val()).map(([id, member]) => ({    
      id,    
      ...(member as Member)    
    }))    
  } catch (error) {    
    console.error(error)    
    alert('Failed to load members.')    
  }    
}    
    
const filteredMembers = computed(() => { // Filters the member list
  const keyword = search.value.toLowerCase().trim()    
  if (!keyword) return members.value    
    
  return members.value.filter(member => {    
    const fullName = String(member.name || '').toLowerCase().trim()    
    const lastName = fullName.split(',')[0].trim()    
    const memberId = String(member.memberId || '').toLowerCase().trim()    
    const contact = String(member.contact || '').trim()    
    const course = String(member.course || '').toLowerCase().trim()    
    const yearLevel = String(member.yearLevel || '').toLowerCase().trim()    
    const position = String(member.position || '').toLowerCase().trim()    
    
    const contactDigits = contact.replace(/\D/g, '')    
    const keywordDigits = keyword.replace(/\D/g, '')    
    
    if (/^bs[a-z]*$/.test(keyword))    
      return course.startsWith(keyword)    
    
    if (keyword.length === 1 && /^[a-z]$/.test(keyword))    
      return lastName.startsWith(keyword)    
    
    if (/^\d{2,}$/.test(keyword))    
      return contactDigits.startsWith(keywordDigits) ||    
        memberId.includes(keyword) ||    
        yearLevel.startsWith(keyword)    
    
    return lastName.startsWith(keyword) ||    
      memberId.startsWith(keyword) ||    
      contactDigits.startsWith(keywordDigits) ||    
      course.startsWith(keyword) ||    
      yearLevel.startsWith(keyword) ||    
      position.startsWith(keyword)    
  })    
})    

const toggleSelect = (id: string) => { // Selects or deselects a member
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(item => item !== id)
  } else {
    selectedIds.value.push(id)
  }
}

const selectAll = () => { // Selects all members
  selectedIds.value = filteredMembers.value.map(member => member.id!)
}

const deselectAll = () => { // Deselects all members
  selectedIds.value = []
}

const deleteSelected = async () => { // Deletes selected members
  if (selectedIds.value.length === 0) return

  if (!confirm(`Are you sure you want to permanently delete ${selectedIds.value.length} member(s)?`)) return

  try {
    await Promise.all(selectedIds.value.map(id => deleteMember(id)))
    members.value = members.value.filter(member => !selectedIds.value.includes(member.id!))
    selectedIds.value = []
    alert('Selected members permanently deleted.')
  } catch (error) {
    console.error(error)
    alert('Failed to delete selected members.')
  }
}
    
const goToAdd = () => router.push('/members/add') // Opens Add Member page
    
const editMember = (id: string) => router.push(`/members/edit/${id}`) // Opens Edit page
    
const removeMember = async (id: string) => { // Deletes a member
  if (!confirm('Are you sure you want to permanently delete this member?')) return    
    
  try {    
    await deleteMember(id)    
    members.value = members.value.filter(member => member.id !== id)
    selectedIds.value = selectedIds.value.filter(item => item !== id)
    alert('Member permanently deleted.')    
  } catch (error) {    
    console.error(error)    
    alert('Failed to delete member.')    
  }    
}    
    
onIonViewWillEnter(loadMembers) // Loads data when page opens
</script>    
    
<style scoped>    
ion-header, ion-toolbar { --background: #0f3d2e; --color: white; }    
    
ion-title {    
  display: flex; align-items: center; gap: 8px;    
  font-family: monospace; font-weight: bold;    
}    
    
ion-content { --background: #eef8f1; }    
    
.list-container { max-width: 700px; margin: auto; padding: 18px; }    
    
.page-header {    
  display: flex; align-items: center; justify-content: space-between;    
  background: #d8f3df; border: 1.5px solid #111;    
  border-radius: 12px; padding: 18px; margin-bottom: 15px;    
}    
    
.page-header h1 { font: bold 19px monospace; color: #0f3d2e; margin: 0 0 5px; }    
.page-header p { font: 12px monospace; color: #315c48; margin: 0; }    
    
.count-box {    
  display: flex; align-items: center; gap: 5px;    
  background: #176b45; color: white;    
  border: 1.5px solid #111; border-radius: 8px;    
  padding: 8px 12px; font-family: monospace; font-weight: bold;    
}    
    
.search {    
  --background: white; --border-radius: 10px; --box-shadow: none;    
  border: 1.5px solid #111; border-radius: 10px;    
  margin-bottom: 15px; padding: 0;    
}    

.select-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.select-actions ion-button {
  margin: 0;
  font-family: monospace;
  font-weight: bold;
  --border-radius: 8px;
  --border-color: #111;
}

.delete-selected {
  --background: #0f3d2e;
  --color: white;
}

.member-card {    
  background: white; border: 1.5px solid #111;    
  border-radius: 12px; padding: 16px;    
  margin-bottom: 15px; box-shadow: 3px 3px 0 #111;    
}    
    
.member-top {    
  display: flex; align-items: center; gap: 12px;    
  padding-bottom: 13px; border-bottom: 1px solid #111;    
}    

.member-top ion-checkbox {
  --size: 20px;
  --checkbox-background-checked: #176b45;
  margin-right: 2px;
}
    
.avatar {    
  width: 48px; height: 48px; min-width: 48px;    
  display: grid; place-items: center;    
  background: #d8f3df; border: 1.5px solid #111; border-radius: 10px;    
}    
    
.avatar ion-icon { color: #176b45; font-size: 25px; }    
    
.member-name h2 { font: bold 16px monospace; color: #0f3d2e; margin: 0 0 4px; }    
.member-name span { font: 11px monospace; color: #315c48; }    
    
.member-info {    
  display: grid; grid-template-columns: 1fr 1fr;    
  gap: 10px; padding: 15px 0;    
}    
    
.info { display: flex; align-items: center; gap: 8px; }    
.info ion-icon { color: #176b45; font-size: 19px; }    
    
.info small, .info strong {    
  display: block; font-family: monospace;    
}    
    
.info small { font-size: 9px; color: #315c48; }    
.info strong { font-size: 11px; color: #111; word-break: break-word; }    
    
.actions { display: flex; gap: 10px; }    
    
.edit-button, .delete-button {    
  flex: 1; margin: 0; font-family: monospace;    
  font-weight: bold; --border-radius: 8px;    
}    
    
.edit-button { --color: #176b45; --border-color: #111; --border-width: 1.5px; }    
    
.delete-button {    
  --background: #0f3d2e;    
  --border-color: #111; --border-width: 1.5px; --border-style: solid;    
}    
    
.empty-card {    
  text-align: center; background: white;    
  border: 1.5px solid #111; border-radius: 12px; padding: 35px 20px;    
}    
    
.empty-card ion-icon { font-size: 45px; color: #176b45; }    
.empty-card h2 { font: bold 16px monospace; color: #0f3d2e; }    
.empty-card p { font: 11px monospace; color: #315c48; }    
    
.add-button {    
  margin-top: 20px; --background: #176b45;    
  --border-radius: 10px; --border-color: #111;    
  --border-width: 1.5px; --border-style: solid;    
  --box-shadow: 3px 3px 0 #111;    
  font-family: monospace; font-weight: bold;    
}    
    
@media (max-width: 500px) {    
  .member-info { grid-template-columns: 1fr; }    
}    
</style>