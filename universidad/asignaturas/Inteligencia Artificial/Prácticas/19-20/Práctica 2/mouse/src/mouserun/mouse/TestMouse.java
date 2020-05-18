package mouserun.mouse;		
import mouserun.game.*;		
import java.util.*;			

public class TestMouse
	extends Mouse				
{

	private Grid lastGrid;

	public TestMouse()
	{
		super("Test");		
	}
	
	public int move(Grid currentGrid, Cheese cheese)
	{
		Random random = new Random();
		ArrayList<Integer> possibleMoves = new ArrayList<Integer>();
		if (currentGrid.canGoUp()) possibleMoves.add(Mouse.UP);
		if (currentGrid.canGoDown()) possibleMoves.add(Mouse.DOWN);
		if (currentGrid.canGoLeft()) possibleMoves.add(Mouse.LEFT);
		if (currentGrid.canGoRight()) possibleMoves.add(Mouse.RIGHT);
		possibleMoves.add(Mouse.BOMB);
				
		if (possibleMoves.size() == 1)
		{
			lastGrid = currentGrid;
			return possibleMoves.get(0);
		}
		else
		{
			if (!testGrid(Mouse.UP, currentGrid)) possibleMoves.remove((Integer)Mouse.UP);
			if (!testGrid(Mouse.DOWN, currentGrid)) possibleMoves.remove((Integer)Mouse.DOWN);
			if (!testGrid(Mouse.LEFT, currentGrid)) possibleMoves.remove((Integer)Mouse.LEFT);
			if (!testGrid(Mouse.RIGHT, currentGrid)) possibleMoves.remove((Integer)Mouse.RIGHT);
		
			if (possibleMoves.size() == 0)
			{
				if (currentGrid.canGoUp()) possibleMoves.add(Mouse.UP);
				if (currentGrid.canGoDown()) possibleMoves.add(Mouse.DOWN);
				if (currentGrid.canGoLeft()) possibleMoves.add(Mouse.LEFT);
				if (currentGrid.canGoRight()) possibleMoves.add(Mouse.RIGHT);
				possibleMoves.add(Mouse.BOMB);
				
				lastGrid = currentGrid;
				return possibleMoves.get(random.nextInt(possibleMoves.size()));
			}
			else
			{
				lastGrid = currentGrid;
				return possibleMoves.get(random.nextInt(possibleMoves.size()));
			}
		}
		
	}
	
	public void newCheese()
	{
	
	}
	
	public void respawned()
	{
	
	}
	
	private boolean testGrid(int direction, Grid currentGrid)
	{
		if (lastGrid == null)
		{
			return true;
		}	
	
		int x = currentGrid.getX();
		int y = currentGrid.getY();
		
		switch (direction)
		{
			case Mouse.UP: 
				y += 1;
				break;
				
			case Mouse.DOWN:
				y -= 1;
				break;
				
			case Mouse.LEFT:
				x -= 1;
				break;
				
			case Mouse.RIGHT:
				x += 1;
				break;
		}
		
		return !(lastGrid.getX() == x && lastGrid.getY() == y);
		
	}
	
	
}