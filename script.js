// Portable Java -> JS port of calc.java, hero.java and timelapse.java
// Fixed syntax errors, corrected hero snapshot usage and rubyCost default so the script runs again.
// Also kept the pure dpsAtGold selection and the QA threshold logic you requested.

// Helper for Math.log10 in older environments (but modern browsers support it)
if (!Math.log10) Math.log10 = function(x) { return Math.log(x) / Math.LN10; };

class Hero {
  constructor(name="", cost=0, baseDPS=0, costMult=1.0, mult=1.0, upB=[], upL=[], mulChange=0, newMul=1.0) {
    this.name = name;
    this.cost = cost;
    this.baseDPS = baseDPS;
    this.costMult = costMult;
    this.mult = mult;
    this.upB = upB || [];
    this.upL = upL || [];
    this.mulChange = mulChange || 0;
    this.newMul = newMul || mult;
    this.dps = 0; // last-calculated DPS (kept for compatibility)
    this.lvl = 0; // last-calculated level (kept for compatibility)
  }

  // Pure function: compute DPS and level for a given gold without mutating this object
  dpsAtGold(gold) {
    if (this.cost > gold) {
      return { dps: 0, lvl: 0 };
    }
    // compute lvl the same way as the original port
    let raw = (gold - this.cost) / Math.log10(this.costMult);
    let lvl = Math.floor(raw);
    if (!isFinite(lvl) || lvl < 0) lvl = 0;

    let dps = 0;
    if (lvl > 0) {
      // Note: this follows the Java logic in the port.
      dps = Math.log10(lvl) + (Math.log10(this.mult) * (lvl - 175) / 25);
      // Apply Upgrades
      for (let i = 0; i < this.upL.length; i++) {
        if (lvl > (this.upL[i] || 0)) {
          dps = dps + (this.upB[i] || 0);
        }
      }
      // Apply Multiplier Change
      if (lvl > (this.mulChange || 0)) {
        dps = dps + (Math.log10(this.newMul / this.mult)) * (lvl - 175) / 25;
      }
    }

    return { dps: dps + this.baseDPS, lvl };
  }

  // Backwards-compatible: update the hero instance with calcdps(gold)
  // but this method is NOT used for selection anymore to avoid mutation issues.
  calcdps(gold) {
    const res = this.dpsAtGold(gold);
    this.dps = res.dps;
    this.lvl = res.lvl;
    return this.dps;
  }
}

class Timelapse {
  constructor(zone, gain, type, heroSnapshot) {
    this.zone = zone;
    this.gain = gain;
    this.type = type;
    // store a snapshot (plain object) so later changes to hero instances do not mutate the recorded level
    if (heroSnapshot && typeof heroSnapshot === 'object') {
      // shallow copy to be safe
      this.hero = Object.assign({}, heroSnapshot);
    } else {
      this.hero = { name: "No worthwhile timelapse", lvl: 0 };
    }
  }
}

class Calc {
  constructor() {
    this.HS = 0;
    this.xyl = 0;
    this.HZTT = 0;
    this.TP = 0;
    this.heroes = this.herosetup();
    this.timelapses = [];
    this.QA = false;
  }

  herosetup() {
    const heros = [];
    heros.push(new Hero("Betty Clicker",5,3,1.07,4,[103000.0],[4495150.0],0,4));
    heros.push(new Hero("King Midas",12,9,1.07,4,[108000.0],[4692150.0],0,4));
    heros.push(new Hero("Dread Knight",55,48,1.07,4,[3.0,5.0,7.0],[1000.0,2500.0,5500.0],8000,4.25));
    heros.push(new Hero("Atlas",450,399,1.07,4.25,[5.0,7.0,9.0],[2500.0,9500.0,17500.0],25000,4.5));
    heros.push(new Hero("Terra",1700,1530,1.07,4.5,[5.0,7.0,9.0],[10000.0,32500.0,60000.0],80000,4.75));
    heros.push(new Hero("Phthalo",4900,4497,1.10,9.5,[100.0,200.0,300.0],[10000.0,20000.0,30000.0],44000,10.5));
    heros.push(new Hero("Orntchya Gladeye, Didensy",7000,7167,1.10,10.5,[100.0,200.0,300.0],[12000.0,28000.0,42000.0],55000,11.5));
    heros.push(new Hero("Lilin",9600,10431,1.10,11.5,[100.0,200.0,300.0],[34000.0,54500.0,67000.0],92000,12.5));
    heros.push(new Hero("Cadmia",14000,15215,1.13,75,[300.0,300.0,300.0],[70000.0,11500.0,180000.0],250000,80));
    heros.push(new Hero("Alabaster",16000,18141,1.13,75,[300.0,300.0,300.0],[45000.0,100000.0,165000.0],250000,85));
    heros.push(new Hero("Astraea",17000,19632,1.13,75,[300.0,300.0,300.0],[42000.0,100000.0,170000.0],250000,90));
    heros.push(new Hero("Chiron",33000,44106,1.16,250,[],[],0,250));
    heros.push(new Hero("Moloch",55000,77006,1.16,300,[],[],0,300));
    heros.push(new Hero("Bomber Max",75000,107982,1.16,350,[],[],0,350));
    heros.push(new Hero("Gog",97000,146342,1.16,444,[],[],0,444));
    heros.push(new Hero("Wepawet",125000,193960,1.16,500,[],[],0,500));
    heros.push(new Hero("Tsuchi",150000,235994,1.19,2500,[1000.0,1000.0,1000.0],[50000.0,135000.0,220000.0],285000,5000));
    heros.push(new Hero("Skogur",175000,289394,1.19,5000,[2000.0,2000.0,2000.0],[100000.0,300000.0,500000.0],600000,10000));
    heros.push(new Hero("Moeru",250000,455593,1.19,10000,[2500.0,2500.0,2500.0],[110000.0,325000.0,475000.0],670000,15000));
    heros.push(new Hero("Zilar",315000,607593,1.19,15000,[3000.0,3000.0,3000.0],[150000.0,400000.0,700000.0],1000000,20000));
    heros.push(new Hero("Madzi",420000,859593,1.19,20000,[3500.0,3500.0,3500.0],[150000.0,400000.0,700000.0],1000000,25000));
    heros.push(new Hero("Xavira",510000,1080993,1.22,150000,[5000.0,5000.0,5000.0,5000.0],[750000.0,1000000.0,1250000.0,1500000.0],1800000,175000));
    heros.push(new Hero("Cadu",700000,1566544,1.22,200000,[10000.0,10000.0,10000.0],[850000.0,1800000.0,2800000.0],3500000,300000));
    heros.push(new Hero("Ceus",700000,1566544,1.22,200000,[10000.0,10000.0,10000.0],[495000.0,1350000.0,2250000.0],3100000,250000));
    heros.push(new Hero("Maw",1050000,2486593,1.22,300000,[10000.0,11000.0,12000.0,13000.0,14000.0],[750000.0,1500000.0,2250000.0,3000000.0,3750000.0],4500000,400000));
    heros.push(new Hero("Yachiyl",1475000,3677116,1.22,500000,[28000.0,29000.0,30000.0,31000.0,32000.0,33000.0],[1500000.0,3200000.0,4900000.0,6600000.0,8400000.0,1040000.0],12100000,1000000));
    return heros;
  }

  calcGold(zone, HS) {
    return 28 + Math.log10(1.15) * (zone - 140) + (HS * 1.5);
  }

  // Ported calcZone with same thresholds and branching as Java.
  calcZone(dps, TP) {
    let zone;
    let tempzone = 0;
    let extraDPS;
    zone = dps / Math.log10(1.145);
    if (zone > 5000 && TP > 2) {
      tempzone = 5000;
      extraDPS = dps - 5000 * Math.log10(1.145);
      zone = tempzone + extraDPS / Math.log10(1.16);
      if (zone > 20000 && TP > 3) {
        tempzone = 20000;
        extraDPS = extraDPS - 15000 * Math.log10(1.16);
        zone = tempzone + extraDPS / Math.log10(1.175);
        if (zone > 65000 && TP > 4) {
          tempzone = 65000;
          extraDPS = extraDPS - 45000 * Math.log10(1.175);
          zone = tempzone + extraDPS / Math.log10(1.3);
          if (zone > 150000 && TP > 8) {
            tempzone = 150000;
            extraDPS = extraDPS - 85000 * Math.log10(1.3);
            zone = tempzone + extraDPS / Math.log10(1.354);
            if (zone > 250000 && TP > 10) {
              tempzone = 250000;
              extraDPS = extraDPS - 100000 * Math.log10(1.354);
              zone = tempzone + extraDPS / Math.log10(1.45);
              if (zone > 360000 && TP > 15) {
                tempzone = 360000;
                extraDPS = extraDPS - 110000 * Math.log10(1.45);
                zone = tempzone + extraDPS / Math.log10(1.55);
                if (zone > 370000 && TP > 20) {
                  tempzone = 370000;
                  extraDPS = extraDPS - 10000 * Math.log10(1.55);
                  zone = tempzone + extraDPS / Math.log10(1.65);
                  if (zone > 380000 && TP > 25) {
                    tempzone = 380000;
                    extraDPS = extraDPS - 10000 * Math.log10(1.65);
                    zone = tempzone + extraDPS / Math.log10(1.75);
                    if (zone > 480000 && TP > 30) {
                      tempzone = 480000;
                      extraDPS = extraDPS - 100000 * Math.log10(1.75);
                      zone = tempzone + extraDPS / Math.log10(1.85);
                      if (zone > 500000 && TP > 35) {
                        tempzone = 500000;
                        extraDPS = extraDPS - 10000 * Math.log10(1.85);
                        zone = tempzone + extraDPS / Math.log10(1.95);
                        if (zone > 1000000 && TP > 40) {
                          tempzone = 1000000;
                          extraDPS = extraDPS - 500000 * Math.log10(1.95);
                          zone = tempzone + extraDPS / Math.log10(2.1);
                          if (zone > 1200000 && TP > 45) {
                            tempzone = 1200000;
                            extraDPS = extraDPS - 200000 * Math.log10(2.1);
                            zone = tempzone + extraDPS / Math.log10(2.3);
                            if (zone > 1400000 && TP > 50) {
                              tempzone = 1400000;
                              extraDPS = extraDPS - 200000 * Math.log10(2.3);
                              zone = tempzone + extraDPS / Math.log10(2.45);
                              if (zone > 1500000 && TP > 55) {
                                tempzone = 1500000;
                                extraDPS = extraDPS - 100000 * Math.log10(2.45);
                                zone = tempzone + extraDPS / Math.log10(2.65);
                                if (zone > 2000000 && TP > 60) {
                                  tempzone = 2000000;
                                  extraDPS = extraDPS - 500000 * Math.log10(2.65);
                                  zone = tempzone + extraDPS / Math.log10(3);
                                  if (zone > 2500000 && TP > 70) {
                                    tempzone = 2500000;
                                    extraDPS = extraDPS - 500000 * Math.log10(3);
                                    zone = tempzone + extraDPS / Math.log10(3.3);
                                    if (zone > 3000000 && TP > 80) {
                                      tempzone = 3000000;
                                      extraDPS = extraDPS - 500000 * Math.log10(3.3);
                                      zone = tempzone + extraDPS / Math.log10(3.6);
                                      if (zone > 3500000 && TP > 90) {
                                        tempzone = 3500000;
                                        extraDPS = extraDPS - 500000 * Math.log10(3.6);
                                        zone = tempzone + extraDPS / Math.log10(4);
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return zone;
  }

  // The main compute loop. Returns an object with timelapses array, rubySpend and QA flag.
  compute({TP=1, HS=0, xyl=0, HZTT=0, precision=1} = {}) {
    this.TP = TP;
    this.HS = HS;
    this.xyl = xyl;
    this.HZTT = HZTT;
    this.timelapses = [];
    this.QA = false;

    const xylbonus = (25.05 * (1 - Math.exp(xyl * -0.04)) / 100) + 1;
    const dpsHSeffect = HS * (0.5 + 0.5 + 1 + 0.4 * (1 + xylbonus));

    let zonesgained = 1000000;
    let startZone = 0;
    if (HZTT > 900000) {
      startZone = HZTT - 500000;
    } else if (HZTT > 200000) {
      startZone = 50000 * Math.ceil((HZTT - 200000) / 100000);
    }
    let newZone;
    let best = 0;
    let bestHero = null;
    let bestHeroLvl = 0; // capture level (pure) for the selected hero
    let rubySpend = 0;
    let rubyCost = 0;

    // safety cap — avoid runaway infinite loops in the ported UI
    const safetyIterMax = 5000;
    let iter = 0;

    while (zonesgained > precision) {
      iter++;
      if (iter > safetyIterMax) {
        console.warn("safety break: max iterations reached");
        break;
      }

      const gildbonus = Math.log10(1.01) * HZTT / 10;
      const gold = this.calcGold(startZone, HS);
      best = 0;
      bestHero = null;
      bestHeroLvl = 0;

      // Pick optimal hero using pure dpsAtGold (avoid mutating hero.lvl during selection)
      for (let h of this.heroes) {
        const { dps: hDps, lvl: hLvl } = h.dpsAtGold(gold);
        if (hDps > best) {
          best = hDps;
          bestHero = h;
          bestHeroLvl = hLvl;
        }
        if (hDps === 0) {
          break;
        }
      }

      // If no hero yields positive DPS, break (same behavior as original)
      if (!bestHero) break;

      // Calculate zones gained using the selected hero's DPS
      newZone = this.calcZone(best + gildbonus + dpsHSeffect, TP);
      zonesgained = Math.floor(newZone - startZone);

      if (zonesgained < precision) {
        break;
      }

      // Pick timelapse duration
      let tltype = "8hr";
      rubyCost = 20;
      if (zonesgained > 360000) {
        tltype = "168hr";
        rubyCost = 100;
        if (zonesgained > 756000) zonesgained = 756000;
      } else if (zonesgained > 162000) {
        tltype = "48hr";
        rubyCost = 60;
        if (zonesgained > 216000) zonesgained = 216000;
      } else if (zonesgained > 72000) {
        tltype = "24hr";
        rubyCost = 40;
        if (zonesgained > 108000) zonesgained = 108000;
      } else if (zonesgained > 36000) {
        zonesgained = 36000;
      }

      newZone = startZone + zonesgained;
      startZone = newZone;

      // Capture a snapshot of the hero level at selection time (use the pure bestHeroLvl)
      const heroSnapshot = { name: bestHero.name, lvl: bestHeroLvl };
      const t = new Timelapse(newZone, zonesgained, tltype, heroSnapshot);
      this.timelapses.push(t);

      // add ruby cost and compute QA using the requested formula (safely)
      rubySpend = rubySpend + rubyCost;

      // Compute first hero level for QA check — use pure computation at the same gold we used for selection
      const firstHeroLevel = Math.max(1, this.heroes[0].dpsAtGold(gold).lvl || 1);
      const qaThreshold = 100 + 20 * ((Math.log10(firstHeroLevel) + 1) / 3);
      if (rubySpend >= qaThreshold) {
        this.QA = true;
      }

      if (newZone > HZTT) {
        HZTT = newZone;
      }
    }

    return {
      timelapses: this.timelapses,
      rubySpend,
      QA: this.QA
    };
  }
}
