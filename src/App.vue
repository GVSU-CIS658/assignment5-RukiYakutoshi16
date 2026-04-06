<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <div v-if="beverageStore.user == null"> <button @click="signIn">Log in to brew</button></div>
    <div v-if="beverageStore.user !== null">
      <span>Welcome {{  beverageStore.user.displayName }}</span>
       <button @click="signOut">Log out</button>
      </div>
    <input type="text" placeholder="Beverage Name" v-model="bev_name"/>
    <button @click="makeBeverage( bev_name )" >🍺 Make Beverage</button>

  </div>
  <div>
    <p v-if="beverageStore.user == null">Please sign in before make beverages</p>
    <ul v-if="beverageStore.user !== null">
      <li>
        <template v-for="savedBev in beverageStore.beverages" :key="savedBev.id">
          <label>
            <input
              @click="showBeverage(savedBev)"
              name = "beverage"
              type="radio"
            />
            {{ savedBev.name}}
          </label>
        </template>
      </li>
    </ul>

  </div>
  <div id="beverage-container" style="margin-top: 20px"></div>
</template>

<script setup lang="ts">
import {
  User,
  getAuth,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { onMounted } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const auth = getAuth();
const provider = new GoogleAuthProvider();
const beverageStore = useBeverageStore();
const {showBeverage} = useBeverageStore();
const {setUser} = useBeverageStore();
const {makeBeverage} = useBeverageStore();

var bev_name = "";

onMounted(()=>beverageStore.init());

const signIn = ()=>{
  signInWithPopup(auth,provider)
         .then((result: UserCredential) => {GoogleAuthProvider.credentialFromResult(result); 
                                                   beverageStore.user = result.user;
                                                  })
         .catch((err: any) => {console.error("Sign in failed ", err)}).finally(()=>{setUser(beverageStore.user?.email as string)})
} 

const signOut = () =>{
onAuthStateChanged(auth,(user:User|null)=> {
 if(user!=null){
    beverageStore.user = null;
    beverageStore.beverages = [];
    beverageStore.userBev = [];
  
 }

});
}

//setUser("LloydNguyen@gmail.com");

</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
</style>
