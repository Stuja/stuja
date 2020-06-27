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

import mouserun.game.common.*;
import javax.swing.*;

/**
 * Class BombRepresent is a link between the Bomb and its Game Interface representation.
 */
public class BombRepresent
{
	private Bomb bomb;
	private ImagedPanel represent;
	private JLabel theLabel;
	
	/**
	 * Creates an instance of BombRepresent.
	 * @param bomb The bomb that is to be represented.
	 * @param represent The ImagedPanel component that represents the bomb in the user interface.
	 * @see ImagedPanel
	 */
	public BombRepresent(Bomb bomb, ImagedPanel represent, JLabel theLabel)
	{
		this.bomb = bomb;
		this.represent = represent;
		this.theLabel = theLabel;
	}
	
	/**
	 * Get the bomb instance that is represented.
	 * @return The bomb instance that is represented.
	 */
	public Bomb getBomb()
	{
		return bomb;
	}
	
	/**
	 * Get the ImagedPanel representing the bomb.
	 * @return The ImagedPanel that represents the bomb.
	 */
	public ImagedPanel getRepresent()
	{
		return represent;
	}
	
	/**
	* Get the Label that displays the owner of the bomb.
	* @return The label that displays the owner of the bomb.
	*/
	public JLabel getLabel()
	{
		return theLabel;
	}
	
}