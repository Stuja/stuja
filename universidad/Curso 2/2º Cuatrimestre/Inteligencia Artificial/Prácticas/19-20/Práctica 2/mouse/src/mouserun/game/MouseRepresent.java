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
import java.io.*;
import javax.swing.*;
import java.text.DecimalFormat;

/**
 * Class MouseRepresent is the link between the MouseController and the Mouse
 * graphical interface. It is also responsible for moving the mouse on each turn
 * towards the target grid of the mouse and display the correct asset image to
 * represent the moving direction.
 */
public class MouseRepresent
{
	private GameController controller;
	private MouseController mouse;
	private ImagedPanel represent;
	private JLabel nameLabel;
	private JLabel cheeseLabel;
	private int lastDirection;
	private String leftAsset;
	private String rightAsset;
	private String downAsset;
	private String upAsset;
	private String name;
	private DecimalFormat format;
	private int cheeseDisplayDuration;

	/**
	 * Creates a new instance of the MouseRepresent
	 * @param controller The game controller, hosting the game.
	 * @param mouse The MouseController that will be represented by the MouseRepresent
	 * @param represent The ImagedPanel that will display the Mouse on the game interface
	 * @param nameLabel The Label that will display the Mouse name on the game interface
	 * @param upAsset The asset that display the Mouse going upward
	 * @param downAsset The asset that display the Mouse going downward
	 * @param leftAsset The asset that display the Mouse going left
	 * @param rightAsset The asset that display the Mouse going right
	 */
	public MouseRepresent(GameController controller, MouseController mouse, ImagedPanel represent, JLabel nameLabel, JLabel cheeseLabel,
		String upAsset, String downAsset, String leftAsset, String rightAsset)
	{
		this.controller = controller;
		this.mouse = mouse;
		this.represent = represent;
		this.nameLabel = nameLabel;
		this.cheeseLabel = cheeseLabel;
		this.format = new DecimalFormat(GameConfig.CHEESE_NUMBER_FORMAT);
		this.cheeseDisplayDuration = 0;
		
		String name = mouse.getMouse().getName();
		if (name.length() > 13)
		{
			name = name.substring(0, 10) + "...";
		}
		
		this.name = name;
		
		this.nameLabel.setText("(" + mouse.getNumberOfCheese() + ") " + name);
		this.nameLabel.setSize(this.nameLabel.getPreferredSize());

		this.upAsset = upAsset;
		this.downAsset = downAsset;
		this.leftAsset = leftAsset;
		this.rightAsset = rightAsset;
		
		this.lastDirection = 0;
	}
	
	public String getName()
	{
		return this.name;
	}
	
	/**
	 * This method is responsible for moving the mouse towards it target grid. It will
	 * invoke the GameController to inform of its movement.
	 * @return True if mouse is ready to receive a new instruction. False if otherwise
	 * @throws IOException An IOException can occur if the assets required are missing
	 */
	public Grid control()
		throws IOException
	{
		int direction = 0;
		int targetX = controller.getGridLeft(mouse.getTargetGrid().getX());
		int targetY = controller.getGridTop(mouse.getTargetGrid().getY());
		
		int x = represent.getX();
		int y = represent.getY();
		
		int leeway = GameConfig.PIXELS_ON_TARGET_LEEWAY;
		
		if (x > targetX + leeway)
		{
			x -= mouse.getSpeed();
			direction = 1;
		}
		
		if (x < targetX - leeway)
		{
			x += mouse.getSpeed();
			direction = 2;
		}
		
		if (y > targetY + leeway)
		{
			y -= mouse.getSpeed();
			direction = 3;
		}
		
		if (y < targetY - leeway)
		{
			y += mouse.getSpeed();
			direction = 4;
		}
		
		if (lastDirection != direction)
		{
			lastDirection = direction;
			
			switch (direction)
			{
				case 1:
					represent.setImage(this.leftAsset);
					break;
					
				case 2:
					represent.setImage(this.rightAsset);
					break;
					
				case 3:
					represent.setImage(this.upAsset);
					break;
				
				case 4:
					represent.setImage(this.downAsset);
					break;
			}
		}
						
		represent.setLocation(x, y);
		nameLabel.setLocation(x, y + represent.getHeight());
		cheeseLabel.setLocation(x + (represent.getWidth() / 4), y - 20);
		nameLabel.setText(name);
		
		if (cheeseDisplayDuration > 0)
		{
			cheeseLabel.setText(format.format(mouse.getNumberOfCheese()));
			cheeseDisplayDuration--;
		}
		else
		{
			cheeseLabel.setText("");
		}
		
		return controller.report(this, x, y);
	}
	
	/**
	*	Gets the Mouse's next move
	*	@param targetGrid The grid the Mouse is currently at
	*	@return The Mouse move decision
	*/
	public int getNextMove(Grid targetGrid)
	{
		return controller.getMouseNextMove(mouse, targetGrid);
	}
	
	/**
	*	Causes the mouse to move
	*	@param move The move decision made by the Mouse.
	*/
	public void moveMouse(int move)
	{
		controller.causeMouseMove(mouse, move);
	}
	
	public void displayCheeseNumber()
	{
		cheeseDisplayDuration = GameConfig.MOUSE_CHEESE_DISPLAY_LENGTH;
	}
	
	/**
	 * Gets the JPanel that represents the Mouse.
	 * @return The JPanel that represents the Mouse.
	 */
	public JPanel getRepresent()
	{
		return this.represent;
	}
	
	/**
	 * Gets The MouseController whose Mouse is represented by MouseRepresent
	 * @return The MouseController represented by this instance.
	 */
	public MouseController getMouseController()
	{
		return this.mouse;
	}
	
	/**
	*	Causes the Mouse to display that is has retired.
	*/
	public void retire()
	{
		this.nameLabel.setText(getName() + " is retired.");
		cheeseLabel.setText("XXX");
	}

}