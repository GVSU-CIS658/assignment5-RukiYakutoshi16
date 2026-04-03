import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  onSnapshot,
  QueryEndAtConstraint,
} from "firebase/firestore";

import { User } from "firebase/auth"

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    user: null as User | null,
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
  }),

  actions: {
    init() {
      const myBases = collection(db, "bases");
      getDocs(myBases).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          this.bases.push(qd.data() as BaseBeverageType)
        })
      });
      const mySyrups = collection(db, "syrups");
      getDocs(mySyrups).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          this.syrups.push(qd.data() as SyrupType)
        })
      });

      const myCreamers = collection(db, "creamers");
      getDocs(myCreamers).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          this.creamers.push(qd.data() as CreamerType)
        })
      });
    },

    setUser(user: User, beverageType: BeverageType) {
      const coll = collection()
      //TODO
    },
    makeBeverage() {
      if (this.user == null) {

      }
    },

    showBeverage() { console.log("display Beverage") },
  },
});
