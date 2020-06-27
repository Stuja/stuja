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
import java.io.*;

/**
 * Interface GameControllerAdapter provides the interface for the GameController to 
 * raise events that occurred during the game to be reflected in the Game Interface.
 */
public interface GameControllerAdapter
{

	/**
	 * This method will be invoked during game load to introduce new mouse
	 * into the user interface. The adapter must be able to maintain the mouse
	 * and its represent.
	 * @param mouse The new mouse controller that was being loaded.
	 * @throws IOException As a new mouse is introduced, the adapter has to create a new represent, 
	 * loading the appropriate assets. If the assets required are missing, this method should throw an 
	 * IOException.
	 */
	public void newMouse(MouseController mouse) throws IOException;

	/**
	 * This method will be invoked each time the cheese changes location. 
	 * Old cheese represent should be removed. 
	 * @param newCheese The cheese instance.
	 */
	public void newCheese(Cheese newCheese);
	
	/**
	 * This method will be invoked at the end of the game. The mouse
	 * represent should be removed.
	 */
	public void clearMouse();
	
	/**
	 * This method will be invoked when a mouse planted a new bomb. The 
	 * adapter should create a represent of the new bomb.
	 * @param bomb The bomb instance.
	 * @throws IOException When the method creates a represent for the new bomb, the
	 * IOException would be thrown if the required assets are missing.
	 */
	public void newBomb(Bomb bomb) throws IOException;
	
	/**
	 * This method will be invoked when a mouse crosses a bomb. The adapter
	 * should change the image of the represent of the bomb appropriately.
	 * @param bomb The bomb instance.
	 * @throws IOException When the method changes the image of the represent, the
	 * IOException would be thrown if the required assets are missing.
	 */
	public void detonateBomb(Bomb bomb) throws IOException;
	
	/**
	 * This method will be invoked when the bomb represent is to be removed.
	 * @param bomb The bomb instance.
	 */
	public void removeBomb(Bomb bomb);
	
	/**
	 * This method will be invoked when the mouse represent has to be repositioned.
	 * @param mouse The mouse to be moved.
	 * @param grid The grid that the mouse is to be moved to.
	 */
	public void repositionMouse(MouseController mouse, Grid grid);
	
	/**
	 * This method will be invoked and adapter has to prepare all necessary preloading and 
	 * starts the game. 
	 */
	public void start();
	
	/** 
	 * This method will be invoked and adapter has to cause all represents to halt.
	 */
	public void stop();
	
	/**
	* This method is to be invoked when showing the number of seconds left to the game end.
	*/
	public void displayCountDown(int seconds);

}