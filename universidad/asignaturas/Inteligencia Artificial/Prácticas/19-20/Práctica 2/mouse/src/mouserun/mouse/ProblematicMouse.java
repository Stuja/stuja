package mouserun.mouse;		
import mouserun.game.*;		
import java.util.*;			

public class ProblematicMouse
	extends Mouse				
{

	private Grid lastGrid;

	public ProblematicMouse()
	{
		super("Problematic");		
	}
	
	public int move(Grid currentGrid, Cheese cheese)
	{
		boolean loop = true;
		int i = Integer.MIN_VALUE;
		while (loop)
		{
			if (i < Integer.MAX_VALUE)
			{
				i++;
			}
			else
			{
				i = Integer.MIN_VALUE;
			}
		}
		
		return Mouse.UP;
	}
	
	public void newCheese()
	{
	
	}
	
	public void respawned()
	{
	
	}
	
}