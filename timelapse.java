

public class timelapse
{
    // instance variables - replace the example below with your own
    double gain;
    double zone;
    String type;
    hero hero;
    /**
     * Constructor for objects of class timelapse
     */
    public timelapse(double zone, double gain, String type, hero hero)
    {
        this.zone = zone;
        this.gain = gain;
        this.type = type;
        if(hero != null){
            this.hero = hero;
        }else{
            this.hero = new hero();
        }
    }

    /**
     * nice string format
     */
    @Override
    public String toString()
    {
        // put your code here
        return "Duration: "+ type+ "  Hero: " + hero.name + "  Level: " + hero.lvl + "  Zone: " + zone + " (+" + gain + ")";
    }
}
