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

/**
 * Abstract Class Mouse should be the base class of all Mouse implementations. Players
 * implementing the Mouse must implement all abstract methods and place the mouse in 
 * the mouserun.mouse package. MouseLoader will locate all mouse implementation in the
 * package.
 */
public abstract class Mouse
{

	public static final int UP 		=	1;
	public static final int DOWN		=	2;
	public static final int LEFT		=	3;
	public static final int RIGHT		=	4;
	public static final int BOMB       = 	5;
	
	private String name;
        
        // New: 01-21-2016
        // New private field, different grids visited by the mouse
        private long exploredGrids;
        
        // New: 01-21-2016
        // New private field, total grids visited by the mouse
        private long steps;
	
	/**
	 * Creates a new instance of Mouse.
	 * @param name The name of the Mouse to appear in the game interface.
	 */
	public Mouse(String name)
	{
		this.name = name;
                this.exploredGrids = 0; // New: 01-21-2016
                this.steps = 0; // New: 01-21-2016
	}
	
	/**
	 * Get the name of the mouse that appears on the game interface.
	 * @return The name of the mouse.
	 */
	public String getName()
	{
		return this.name;
	}
	
        // New: 01-21-2016
        /**
         * Get the current number of unique visited grids.
         * It must be managed by the user himself
         * @return number of unique visited grids
         */
        public long getExploredGrids()
        {
            return this.exploredGrids;
        }
        
        // New: 01-21-2016
        /**
         * Increment the current number of unique visited grids.
         * Use it fairly
         * @return updated number of unique visited grids
         */
        public long incExploredGrids()
        {
            return this.exploredGrids++;
        }
        
        // New: 01-21-2016
        /**
         * Get the current number of visited grids (steps).
         * It must be managed by the user himself
         * @return total number of visited grids (steps)
         */
        public long getSteps()
        {
            return this.steps;
        }
        
        // New: 01-21-2016
        /**
         * Increment the steps (visited grids) given by the mouse.
         * Do not call this method, it is automatically managed by the application
         * @return updated number of visited grids (steps)
         */
        public long incSteps()
        {
            return this.steps++;
        }
        
	/**
	 * The move method is called every time a mouse reaches a new grid. This method
	 * expects a decision to be made and returns the decision to be made on how to 
	 * move the Mouse next. Use the Mouse.UP, Mouse.DOWN, Mouse.LEFT, Mouse.RIGHT,
	 * Mouse.BOMB as options for the decision. Players can do that is need to implement
	 * an intelligent mouse. 
	 * @param currentGrid The current grid the Mouse is at.
	 * @param cheese The cheese to be seek.
	 * @return The decision to move the mouse. Use Mouse.UP, Mouse.DOWN, Mouse.LEFT, Mouse.RIGHT, Mouse.BOMB 
	 */
	public abstract int move(Grid currentGrid, Cheese cheese);
	
	/**
	 * This method is called every time a mouse (including own implementation) consumes
	 * a cheese and a new cheese is relocated. Usually utilized for clean ups.
	 */
	public abstract void newCheese();
	
	/**
	 * This method is called every time the Mouse touches a bomb that is not planted by it.
	 * Usually utilized for calibration.
	 */
	public abstract void respawned();
	
}
