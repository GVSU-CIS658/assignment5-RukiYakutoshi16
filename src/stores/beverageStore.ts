import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
  UserBeverage,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  where,
  doc,
  query,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Query,
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
    userBev: [] as UserBeverage[],
  }),

  actions: {
    init() {
      if (this.bases.length > 0) return;
      const myBases = collection(db, "bases");
      getDocs(myBases).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          this.bases.push(qd.data() as BaseBeverageType);
          this.currentBase = this.bases[0];
        })
      });
      const mySyrups = collection(db, "syrups");
      getDocs(mySyrups).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          this.syrups.push(qd.data() as SyrupType);
          this.currentSyrup = this.syrups[0];
        })
      });

      const myCreamers = collection(db, "creamers");
      getDocs(myCreamers).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          this.creamers.push(qd.data() as CreamerType);
          this.currentCreamer = this.creamers[0];
        })
      });
    },

    setUser(email?: string) {
      const fullpath = "account/" + email;
      const firebaseUser = doc(db, fullpath);

      getDoc(firebaseUser).then((ds: DocumentSnapshot) => {
        if (ds.exists()) {
          const beveragePath = "savedBeverage";
          const firebaseBev = collection(db, beveragePath);
          const userQuery: Query = query(firebaseBev, where("email", "==", this.user?.email));

          getDocs(userQuery).then((qs: QuerySnapshot) => {
            qs.forEach((qd: QueryDocumentSnapshot) => {
              this.userBev.push(qd.data() as UserBeverage);
            });
          }).finally(() => this.userBev.forEach(x => this.beverages.push(x.savedBev)));
        }
        else { setDoc(firebaseUser, { id: email }); }
      }).catch((error: any) => console.log("error", error))


      //TODO
    },
    makeBeverage(name: string) {
      if (this.user == null) {
        return;
      }
      const currentBev: BeverageType = {
        id: name + this.user.email,
        name,
        temp: this.currentTemp,
        base: this.currentBase as BaseBeverageType,
        syrup: this.currentSyrup as SyrupType,
        creamer: this.currentCreamer as CreamerType,
      }
      const path = "savedBeverage";
      const savedBev = collection(db, path);
      addDoc(savedBev, { savedBev: currentBev, email: this.user?.email });
      this.beverages.push(currentBev);


    },

    showBeverage(selectedBev: BeverageType) {
      this.currentTemp = selectedBev.temp;
      this.currentBase = selectedBev.base
      this.currentSyrup = selectedBev.syrup;
      this.currentCreamer = selectedBev.creamer;
    },
  },
});
