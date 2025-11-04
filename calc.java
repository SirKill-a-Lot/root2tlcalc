import java.util.*;

public class calc
{
    double HS;
    double xyl;
    double HZTT;
    double TP;
    List<hero> heroes;
    List<timelapse> timelapses = new ArrayList<>();
    /**
     * Constructor for objects of class calc
     */
    public calc()
    {
        //Initialize
        Scanner input = new Scanner(System.in);
        heroes = herosetup();
        while(true){
           //Gather input, calculate static values
           System.out.println("Input: TP HS Xyl HZTT Precision");
           TP = input.nextDouble();
           HS = input.nextDouble();
           xyl = input.nextDouble();
           HZTT = input.nextDouble();
           double precision = input.nextDouble();
           double xylbonus = (25.05*(1-Math.exp(xyl*-0.04))/100)+1;
           double dpsHSeffect = HS*(0.5+0.5+1+0.4*(1+xylbonus));
           double zonesgained = 1000000;
           double startZone = 0;
           if(HZTT > 900000){
               startZone = HZTT-500000;
           }else if(HZTT > 200000){
               startZone = 50000*Math.ceil((HZTT-200000)/100000);
           }
           double newZone;
           double best = 0;
           hero bestHero = null;
           while(zonesgained > precision){
               double gildbonus = Math.log10(1.01)*HZTT/10;
               double gold = calcGold(startZone, HS);
               best = 0;
               
               //Pick optimal hero
               
               for(hero h: heroes){
                   h.dps = h.calcdps(gold);
                   if(h.dps>best){
                       best = h.dps;
                       bestHero = h;
                   }
                   if(h.dps==0){
                       break;
                   }
               }
               
               //Calculate Zones Gained
               
               newZone = calcZone(best+gildbonus+dpsHSeffect, TP);
               zonesgained = Math.floor(newZone-startZone);
               
               //Pick timelapse duration
               String tltype = "8hr";
               if(zonesgained > 360000){
                   tltype = "168hr";
                   if(zonesgained > 756000){
                       zonesgained = 756000;
                   }
               }else if(zonesgained > 162000){
                   tltype = "48hr";
                   if(zonesgained > 216000){
                       zonesgained = 216000;
                   }
               }else if(zonesgained > 72000){
                   tltype = "24hr";
                   if(zonesgained > 108000){
                       zonesgained = 108000;
                   }
               }else if(zonesgained > 36000){
                   zonesgained = 36000;
               }
               newZone = startZone+zonesgained;
               startZone = newZone;
               if(newZone > HZTT){
                   HZTT = newZone;
               }
               timelapse t = new timelapse(newZone, zonesgained, tltype, bestHero);
               timelapses.add(t);
               System.out.println(t.toString());
           }
           //for(timelapse t:timelapses){
           //    System.out.println(t.toString());
           //}
        }
    }
    
    //Load hero data - note the lack of Midas/Betty, they're only relevant for about 1 ascension each.
    public List<hero> herosetup(){
        List<hero> heros = new ArrayList<hero>();
        heros.add(new hero("Dread Knight",55,48,1.07,4,List.of(3.0,5.0,7.0),List.of(1000.0,2500.0,5500.0),8000,4.25));
        heros.add(new hero("Atlas",450,399,1.07,4.25,List.of(5.0,7.0,9.0),List.of(2500.0,9500.0,17500.0),25000,4.5));
        heros.add(new hero("Terra",1700,1530,1.07,4.5,List.of(5.0,7.0,9.0),List.of(10000.0,32500.0,60000.0),80000,4.75));
        heros.add(new hero("Phthalo",4900,4497,1.10,9.5,List.of(100.0,200.0,300.0),List.of(10000.0,20000.0,30000.0),44000,10.5));
        heros.add(new hero("Orntchya Gladeye, Didensy",7000,7167,1.10,10.5,List.of(100.0,200.0,300.0),List.of(12000.0,28000.0,42000.0),55000,11.5));
        heros.add(new hero("Lilin",9600,10431,1.10,11.5,List.of(100.0,200.0,300.0),List.of(34000.0,54500.0,67000.0),92000,12.5));
        heros.add(new hero("Cadmia",14000,15215,1.13,75,List.of(300.0,300.0,300.0),List.of(70000.0,11500.0,180000.0),250000,80));
        heros.add(new hero("Alabaster",16000,18141,1.13,75,List.of(300.0,300.0,300.0),List.of(45000.0,100000.0,165000.0),250000,85));
        heros.add(new hero("Astraea",17000,19632,1.13,75,List.of(300.0,300.0,300.0),List.of(42000.0,100000.0,170000.0),250000,90));
        heros.add(new hero("Chiron",33000,44106,1.16,250,List.of(),List.of(),0,250));
        heros.add(new hero("Moloch",55000,77006,1.16,300,List.of(),List.of(),0,300));
        heros.add(new hero("Bomber Max",75000,107982,1.16,350,List.of(),List.of(),0,350));
        heros.add(new hero("Gog",97000,146342,1.16,444,List.of(),List.of(),0,444));
        heros.add(new hero("Wepawet",125000,193960,1.16,500,List.of(),List.of(),0,500));
        heros.add(new hero("Tsuchi",150000,235994,1.19,2500,List.of(1000.0,1000.0,1000.0),List.of(50000.0,135000.0,220000.0),285000,5000));
        heros.add(new hero("Skogur",175000,289394,1.19,5000,List.of(2000.0,2000.0,2000.0),List.of(100000.0,300000.0,500000.0),600000,10000));
        heros.add(new hero("Moeru",250000,455593,1.19,10000,List.of(2500.0,2500.0,2500.0),List.of(110000.0,325000.0,475000.0),670000,15000));
        heros.add(new hero("Zilar",315000,607593,1.19,15000,List.of(3000.0,3000.0,3000.0),List.of(150000.0,400000.0,700000.0),1000000,20000));
        heros.add(new hero("Madzi",420000,859593,1.19,20000,List.of(3500.0,3500.0,3500.0),List.of(150000.0,400000.0,700000.0),1000000,25000));
        heros.add(new hero("Xavira",510000,1080993,1.22,150000,List.of(5000.0,5000.0,5000.0,5000.0),List.of(750000.0,1000000.0,1250000.0,1500000.0),1800000,175000));
        heros.add(new hero("Cadu",700000,1566544,1.22,200000,List.of(10000.0,10000.0,10000.0),List.of(850000.0,1800000.0,2800000.0),3500000,300000));
        heros.add(new hero("Ceus",700000,1566544,1.22,200000,List.of(10000.0,10000.0,10000.0),List.of(495000.0,1350000.0,2250000.0),3100000,250000));
        heros.add(new hero("Maw",1050000,2486593,1.22,300000,List.of(10000.0,11000.0,12000.0,13000.0,14000.0),List.of(750000.0,1500000.0,2250000.0,3000000.0,3750000.0),4500000,400000));
        heros.add(new hero("Yachiyl",1475000,3677116,1.22,500000,List.of(28000.0,29000.0,30000.0,31000.0,32000.0,33000.0),List.of(1500000.0,3200000.0,4900000.0,6600000.0,8400000.0,1040000.0),12100000,1000000));
        return heros;
    }
    
    public double calcGold(double zone, double HS)
    {
        return 28+Math.log10(1.15)*(zone-140)+(HS*1.5);
    }
    
    //If only the values followed a consistent formula...
    public double calcZone(double dps, double TP){
        double zone;
        double tempzone=0;
        double extraDPS;
        zone = dps/Math.log10(1.145);
        if(zone > 5000 && TP > 2){
            tempzone = 5000;
            extraDPS = dps-5000*Math.log10(1.145);
            zone = tempzone+extraDPS/Math.log10(1.16);
            if(zone > 20000 && TP > 3){
                tempzone = 20000;
                extraDPS = extraDPS-15000*Math.log10(1.16);
                zone = tempzone+extraDPS/Math.log10(1.175);
                if(zone > 65000 && TP > 4){
                    tempzone = 65000;
                    extraDPS = extraDPS-45000*Math.log10(1.175);
                    zone = tempzone+extraDPS/Math.log10(1.3);
                    if(zone > 150000 && TP > 8){
                        tempzone = 150000;
                        extraDPS = extraDPS-85000*Math.log10(1.3);
                        zone = tempzone+extraDPS/Math.log10(1.354);
                        if(zone > 250000 && TP > 10){
                            tempzone = 250000;
                            extraDPS = extraDPS-100000*Math.log10(1.354);
                            zone = tempzone+extraDPS/Math.log10(1.45);
                            if(zone > 360000 && TP > 15){
                                tempzone = 360000;
                                extraDPS = extraDPS-110000*Math.log10(1.45);
                                zone = tempzone+extraDPS/Math.log10(1.55);
                                if(zone > 370000 && TP > 20){
                                    tempzone = 370000;
                                    extraDPS = extraDPS-10000*Math.log10(1.55);
                                    zone = tempzone+extraDPS/Math.log10(1.65);
                                    if(zone > 380000 && TP > 25){
                                        tempzone = 380000;
                                        extraDPS = extraDPS-10000*Math.log10(1.65);
                                        zone = tempzone+extraDPS/Math.log10(1.75);
                                        if(zone > 480000 && TP > 30){
                                            tempzone = 480000;
                                            extraDPS = extraDPS-100000*Math.log10(1.75);
                                            zone = tempzone+extraDPS/Math.log10(1.85);
                                            if(zone > 500000 && TP > 35){
                                                tempzone = 500000;
                                                extraDPS = extraDPS-10000*Math.log10(1.85);
                                                zone = tempzone+extraDPS/Math.log10(1.95);
                                                if(zone > 1000000 && TP > 40){
                                                    tempzone = 1000000;
                                                    extraDPS = extraDPS-500000*Math.log10(1.95);
                                                    zone = tempzone+extraDPS/Math.log10(2.1);
                                                    if(zone > 1200000 && TP > 45){
                                                        tempzone = 1200000;
                                                        extraDPS = extraDPS-200000*Math.log10(2.1);
                                                        zone = tempzone+extraDPS/Math.log10(2.3);
                                                        if(zone > 1400000 && TP > 50){
                                                            tempzone = 1400000;
                                                            extraDPS = extraDPS-200000*Math.log10(2.3);
                                                            zone = tempzone+extraDPS/Math.log10(2.45);
                                                            if(zone > 1500000 && TP > 55){
                                                                tempzone = 1500000;
                                                                extraDPS = extraDPS-100000*Math.log10(2.45);
                                                                zone = tempzone+extraDPS/Math.log10(2.65);
                                                                if(zone > 2000000 && TP > 60){
                                                                    tempzone = 2000000;
                                                                    extraDPS = extraDPS-500000*Math.log10(2.65);
                                                                    zone = tempzone+extraDPS/Math.log10(3);
                                                                    if(zone > 2500000 && TP > 70){
                                                                        tempzone = 2500000;
                                                                        extraDPS = extraDPS-500000*Math.log10(3);
                                                                        zone = tempzone+extraDPS/Math.log10(3.3);
                                                                        if(zone > 3000000 && TP > 80){
                                                                            tempzone = 3000000;
                                                                            extraDPS = extraDPS-500000*Math.log10(3.3);
                                                                            zone = tempzone+extraDPS/Math.log10(3.6);
                                                                            if(zone > 3500000 && TP > 90){
                                                                                tempzone = 3500000;
                                                                                extraDPS = extraDPS-500000*Math.log10(3.6);
                                                                                zone = tempzone+extraDPS/Math.log10(4);
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

}
