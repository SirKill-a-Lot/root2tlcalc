import java.util.*;

public class hero
{
    // instance variables - replace the example below with your own
    double dps;
    double baseDPS;
    double cost;
    double lvl;
    double mult;
    double costMult;
    List<Double> upB; //upgrade bonus
    List<Double> upL; //upgrade threshold level
    String name;
    double mulChange;
    double newMul;
    /**
     * Constructor for objects of class hero
     */
    public hero(String name, double cost, double baseDPS, double costMult, double mult, List<Double> upB, List<Double> upL, double mulChange, double newMul)
    {
        this.name = name;
        this.cost = cost;
        this.baseDPS = baseDPS;
        this.costMult = costMult;
        this.mult = mult;
        this.upB = upB;
        this.upL = upL;
        this.mulChange = mulChange;
        this.newMul = newMul;
    }
    //empty hero for when weird things happen
    public hero(){
        this.name = "No worthwhile timelapse";
        this.lvl = 0;
    }
    
    public double calcdps(double gold)
    {
        if(cost > gold){
            return 0;
        }else{
            lvl = Math.floor((gold-cost)/Math.log10(costMult));
            dps = Math.log10(lvl)+(Math.log10(mult)*lvl/25);
            //Apply Upgrades
            for(int i = 0; i<upL.size(); i++){
                if(lvl > upL.get(i)){
                    dps = dps+upB.get(i);
                }
            }
            //Apply Multiplier Change
            if(lvl > mulChange){
                dps = dps+(Math.log10(newMul/mult))*lvl/25;
            }
            return dps+baseDPS;
        }
    }
}
