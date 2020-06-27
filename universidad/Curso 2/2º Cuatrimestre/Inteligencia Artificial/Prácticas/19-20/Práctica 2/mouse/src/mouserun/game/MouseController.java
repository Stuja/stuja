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
 * Class MouseController is the wrapper class for each Mouse implementation. This class
 * layers the connection between the GameController and the Mouse itself to prevent
 * access to crucial information and manipulation.
 */
public class MouseController
{
	private Mouse mouse;
	private int speed;
	private int numberOfCheese;
	private Grid targetGrid;
	private int numberOfBombs;
	
	/**
	 * Creates a new instance of MouseController
	 * @param mouse The mouse to be wrapped in the controller.
	 */
	public MouseController(Mouse mouse)
	{
		this.mouse = mouse;
		this.speed = GameConfig.PIXELS_PER_TURN;
		this.numberOfCheese = 0;
		this.numberOfBombs = 0;
	}

	/**
	 * This method is called each time the mouse reaches a grid. This bridge to the
	 * move method implemented in the mouse.
	 * @param currentGrid The current grid the Mouse is at.
	 * @param cheese The cheese to seek.
	 * @return The move decision
         * Modified on 01-21-2016 to consider new mouse variable, steps
	 */
	public int onGrid(Grid currentGrid, Cheese cheese)
	{
                // New: 01-21-2016: Steps incremented automatically
                mouse.incSteps();
		return mouse.move(currentGrid, cheese);
	}
	
	/**
	 * Sets the next grid the mouse is heading to.
	 * @param targetGrid The next grid the mouse is heading to.
	 */
	public void setTargetGrid(Grid targetGrid)
	{
		this.targetGrid = targetGrid;
	}
	
	/**
	 * Gets the next grid the mouse is to head to.
	 * @return The next grid the mouse is to head to.
	 */
	public Grid getTargetGrid()
	{
		return this.targetGrid;
	}
		
	/**
	 * Get the Mouse wrapped in this MouseController.
	 * @return Returns the Mouse wrapped in this MouseController
	 */
	public Mouse getMouse() 
	{
		return this.mouse;
	}
	
	/**
	 * Get the number of pixels to move per mouse move turn. 
	 * @return The number of pixels to move per mouse move turn.
	 */
	public int getSpeed()
	{
		return this.speed;
	}
	
	/**
	 * Get the number of cheese the current Mouse has consumed thus far.
	 * @return The number of cheese the current Mouse has consumed.
	 */
	public int getNumberOfCheese()
	{
		return this.numberOfCheese;
	}
	
	/**
	 * Increases the number of cheese consumed by the Mouse.
	 */
	public void increaseNumberOfCheese()
	{
		this.numberOfCheese++;
	}
	
	/**
	 * Gets the number of Bombs the Mouse still has.
	 * @return The number of Bombs available.
	 */
	public int getNumberOfBombs()
	{
		return this.numberOfBombs;
	}
	
	/**
	 * Sets the number of Bombs that Mouse will have.
	 * @param numberOfBombs The number of Bombs the Mouse will have.
	 */
	public void setNumberOfBombs(int numberOfBombs)
	{
		this.numberOfBombs = numberOfBombs;
	}
	
	/**
	 * Creates a new bomb for the Mouse to be planted on the current targetGrid.
	 * If no Bomb is available, null will be returned.
	 * @return The Bomb to be planted by the Mouse. If not available, null will be returned.
	 */
	public Bomb makeBomb()
	{
		if (numberOfBombs > 0)
		{
			numberOfBombs--;
			Bomb bomb = new Bomb(targetGrid.getX(), targetGrid.getY(), this.mouse);
			return bomb;
		}
		
		return null;
	}
	
}
