/** 
 * MouseRun. A programming game to practice building intelligent things.
 * Copyright (C) 2013  Muhammad Mustaqim
 * 
 * This file is part of MouseRun.
 *
 * MouseRun is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MouseRun is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MouseRun.  If not, see <http://www.gnu.org/licenses/>.
 **/
package mouserun.game;
import java.util.*;

/**
 * Class Maze is the board which the Mouse implementations will navigate through to 
 * find the Cheese.
 */
public class Maze
{

	private int width;
	private int height;
	
	private Grid[][] grids;
	
	/**
	 * Creates a new instance of the maze. The maze will automatically build
	 * the layout given the width and the height of the maze.
	 * @param width The width (the number of columns) of the Maze.
	 * @param height The height (the number of rows) of the Maze.
	 */
	public Maze(int width, int height)
	{
		this.width = width;
		this.height = height;

		buildMaze();
	}
	
	// Builds the structure of the maze and adding walls to each grid to 
	// connect the grids to another. This will call the generateMaze method.
	private void buildMaze()
	{
		grids = new Grid[this.width][this.height];
		ArrayList<Wall> walls = new ArrayList<Wall>();
		
		for (int x = 0; x < width; x++)
		{
			for (int y = 0; y < height; y++)
			{
				grids[x][y] = new Grid(x, y);
			}
		}
		
		// assign walls. When assigning walls, the grids at all sides of the
		// maze needs to be careful not to be connecting to anything else.
		for (int x = 0; x < width; x++)
		{
			for (int y = 0; y < height; y++)
			{
				Grid currentGrid = getGrid(x, y);
				
				if (x < width - 1)
				{
					Grid rightGrid = getGrid(x + 1, y);
					Wall wall = new Wall(currentGrid, rightGrid);
					currentGrid.addWall(wall);
					rightGrid.addWall(wall);
					
					walls.add(wall);
				}
				
				if (y < height - 1)
				{
					Grid topGrid = getGrid(x, y + 1);
					Wall wall = new Wall(currentGrid, topGrid);
					currentGrid.addWall(wall);
					topGrid.addWall(wall);
					
					walls.add(wall);
				}				
			}
		}
		
		generateMaze();
	}
	
	
	// Generates the maze using the Depth First Search algorithm. However, the
	// DFS algorithm only produce one path from one grid to another grid. Walls
	// will be opened at random in attempt to produce multiple paths for some
	// scenarios. The number of randomly opened walls will be 3% of the remaining
	// closed walls.
	private void generateMaze()
	{
	
		ArrayList<Grid> unvisitedGrids = new ArrayList<Grid>();
		for (int x = 0; x < width; x++)
		{
			for (int y = 0; y < height; y++)
			{
				unvisitedGrids.add(getGrid(x, y));
			}
		}
	
		Stack<Grid> pathStack = new Stack<Grid>();
		Random random = new Random();
		
		Grid currentGrid = getGrid(random.nextInt(width), random.nextInt(height));
		unvisitedGrids.remove(currentGrid);
		
		pathStack.push(currentGrid);
					
		while (pathStack.size() > 0)
		{
			currentGrid = pathStack.peek();

			ArrayList<Wall> wallsWithUnvisitedGrid = new ArrayList<Wall>();
			for (Wall wall : currentGrid.getWalls())
			{
				Grid mGrid = wall.getNextGrid(currentGrid);
				if (unvisitedGrids.contains(mGrid))
				{
					wallsWithUnvisitedGrid.add(wall);
				}
			}
			
			if (wallsWithUnvisitedGrid.size() > 0)
			{
				Wall selectedWall = wallsWithUnvisitedGrid.get(random.nextInt(wallsWithUnvisitedGrid.size()));
				selectedWall.setOpened(true);
				Grid nextGrid = selectedWall.getNextGrid(currentGrid);
				
				unvisitedGrids.remove(nextGrid);
				pathStack.push(nextGrid);
			}
			else
			{
				pathStack.pop();
			}
		}	
		
		ArrayList<Wall> closedWalls = new ArrayList<Wall>();
		for (int x = 0; x < width; x++)
		{
			for (int y = 0; y < height; y++)
			{
				Grid grid = getGrid(x, y);
				for (Wall wall : grid.getWalls())
				{
					if (!wall.isOpened())
					{
						closedWalls.add(wall);
					}
				}
			}
		}
		
		int closedWallsToOpen = (int)(GameConfig.RATIO_CLOSED_WALL_TO_OPEN * closedWalls.size());
		for (int i = 0; i < closedWallsToOpen; i++)
		{
			closedWalls.get(random.nextInt(closedWalls.size())).setOpened(true);
		}
	}

	/**
	 * Get the Grid in the maze given its row and column number.
	 * @param x The column number of the grid
	 * @param y The row number of the grid
	 * @return The Grid in the maze.
	 */
	public Grid getGrid(int x, int y)
	{
		return grids[x][y];
	}
	
	/**
	 * Get the number of columns defined for this maze.
	 * @return The number of columns (the width)
	 */
	public int getWidth()
	{
		return this.width;
	}
	
	/**
	 * Get the number of rows defined for this maze.
	 * @return The number of rows (the height)
	 */
	public int getHeight()
	{
		return this.height;
	}
	

}