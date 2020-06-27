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
import java.util.*;
import javax.swing.*;
import java.awt.*;

/**
 * Class GameUI is the Game Interface of the game. It uses standard JFrame 
 * etc components in this implementation.
 */
public class GameUI
	extends JFrame
	implements GameControllerAdapter
{
	private Maze maze;
	private GameController controller;
	private int GRID_LENGTH = 30;
	private ImagedPanel[][] mazePanels;
	private JLayeredPane container;
	private JPanel cheesePanel;
	private JLabel countDownLabel;
	private SequencingThread sequencer;
	private CountDownThread countDownThread;
	private ArrayList<BombRepresent> bombs;
	private int duration;
	
	/**
	 * Creates an instance of the GameUI.
	 * @param width The width of the user interface.
	 * @param height The height of the user interface.
	 * @param numberOfCheese The number of cheese this game is playing for.
	 * @throws IOException An IOException can occur when the required game assets are missing.
	 */
	public GameUI(int width, int height, int numberOfCheese, int duration)
		throws IOException
	{
		super(GameConfig.GAME_TITLE);
		GRID_LENGTH = GameConfig.GRID_LENGTH;
		
		this.controller = new GameController(this, width, height, GRID_LENGTH, numberOfCheese);
		this.mazePanels = new ImagedPanel[width][height];
		this.maze = this.controller.getMaze();
		this.bombs = new ArrayList<BombRepresent>();
		this.sequencer = new SequencingThread();
				
		initialiseUI();
		controller.start();
		
		if (duration > 0)
		{
			countDownThread = new CountDownThread(this, duration);
			countDownThread.start();
		}
	}
	
	
	// Loads and defines the frame of the user interface, the maze, the mouse
	// and the objects.
	// @throws IOException An IOException can occur if the required game assets are missing.
	private void initialiseUI()
		throws IOException
	{
		JFrame frame = new JFrame();
		frame.setResizable(false);
		frame.pack();
		
		Insets insets = frame.getInsets();
		container = new JLayeredPane();
		container.setSize(new Dimension((maze.getWidth() * GRID_LENGTH), (maze.getHeight() * GRID_LENGTH)));
	
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		getContentPane().setBackground(Color.BLACK);
		this.setSize((maze.getWidth() * GRID_LENGTH) + insets.left + insets.right , (maze.getHeight() * GRID_LENGTH) + insets.top + insets.bottom);
		this.setLayout(null);
		this.add(container);
		this.setResizable(false);
		
		countDownLabel = new JLabel("");
		countDownLabel.setForeground(Color.WHITE);
		countDownLabel.setFont(new Font("San Serif", Font.PLAIN, GameConfig.COUNT_DOWN_FONT_SIZE));
		container.add(countDownLabel);
		
		for (int x = 0; x < maze.getWidth(); x++)
		{
			for (int y = 0; y < maze.getHeight(); y++)
			{
				Grid grid = maze.getGrid(x, y);
				String assetAddress = "assets/" + grid.getAssetName();
			
				ImagedPanel panel = new ImagedPanel(assetAddress, GRID_LENGTH, GRID_LENGTH);
				mazePanels[x][y] = panel;
			
				panel.setBounds(getGridLeft(x), getGridTop(y), GRID_LENGTH, GRID_LENGTH);
				container.add(panel);
			}
		}
		
		createCheese();
	}
	
	// Creates a panel on the user interface representing a cheese.
	// @throws IOException An IOException can occur if the required game assets are missing.
	private void createCheese()
		throws IOException
	{
		String assetAddress = GameConfig.ASSETS_CHEESE;			
		cheesePanel = new ImagedPanel(assetAddress, GRID_LENGTH, GRID_LENGTH);
		cheesePanel.setOpaque(false);
		
		cheesePanel.setBounds(getGridLeft(5), getGridTop(5), GRID_LENGTH, GRID_LENGTH);
		container.add(cheesePanel);
		container.moveToFront(cheesePanel);
	}
	
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#newMouse(mouserun.game.MouseController)
	 */
	public void newMouse(MouseController mouse)
		throws IOException
	{
		String assetAddress = GameConfig.ASSETS_MOUSEUP;	
		ImagedPanel mousePanel = new ImagedPanel(assetAddress, GRID_LENGTH, GRID_LENGTH);
		mousePanel.setOpaque(false);
		
		JLabel label = new JLabel("009");
		label.setForeground(Color.RED);
		label.setBounds(getGridLeft(0), getGridTop(0), GRID_LENGTH * 2, 20);
		label.setOpaque(false);
		
		JLabel cheeselabel = new JLabel("009");
		cheeselabel.setForeground(Color.ORANGE);
		cheeselabel.setBackground(Color.ORANGE);
		cheeselabel.setBounds(getGridLeft(0), getGridTop(0) - 20, GRID_LENGTH, 20);
		cheeselabel.setOpaque(false);
		
		mousePanel.setBounds(getGridLeft(0), getGridTop(0), GRID_LENGTH, GRID_LENGTH);
		container.add(mousePanel);
		container.add(label);
		container.add(cheeselabel);
		container.moveToFront(mousePanel);
		container.moveToFront(label);
		container.moveToFront(cheeselabel);
		
		MouseRepresent mouseInstance = new MouseRepresent(controller, mouse, mousePanel, label, cheeselabel, GameConfig.ASSETS_MOUSEUP, GameConfig.ASSETS_MOUSEDOWN,
			GameConfig.ASSETS_MOUSELEFT, GameConfig.ASSETS_MOUSERIGHT);
		sequencer.addInstance(mouseInstance);
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#newCheese(mouserun.game.Cheese)
	 */
	public void newCheese(Cheese newCheese)
	{
		cheesePanel.setLocation(getGridLeft(newCheese.getX()), getGridTop(newCheese.getY()));
		container.moveToFront(cheesePanel);
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#newBomb(mouserun.game.Bomb)
	 */
	public void newBomb(Bomb bomb)
		throws IOException
	{
		try
		{
			String assetAddress = GameConfig.ASSETS_BOMB;	
			ImagedPanel bombPanel = new ImagedPanel(assetAddress, GRID_LENGTH, GRID_LENGTH);
			bombPanel.setOpaque(false);
			
			bombPanel.setBounds(getGridLeft(bomb.getX()), getGridTop(bomb.getY()), GRID_LENGTH, GRID_LENGTH);
			container.add(bombPanel);
			container.moveToFront(bombPanel);
			
			JLabel label = new JLabel(bomb.getMouse().getName());
			label.setBounds(getGridLeft(bomb.getX()), getGridTop(bomb.getY()) + GRID_LENGTH, GRID_LENGTH * 2, 20);
			label.setForeground(Color.LIGHT_GRAY);
			label.setOpaque(false);
			container.add(label);
			container.moveToFront(label);
			
			BombRepresent bombRepresent = new BombRepresent(bomb, bombPanel, label);
			bombs.add(bombRepresent);
		}
		catch (Exception ex)
		{
			Debug.out().println("X=" + getGridLeft(bomb.getX()) + ",Y=" + getGridTop(bomb.getY()));
		}
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#detonateBomb(mouserun.game.Bomb)
	 */
	public void detonateBomb(Bomb bomb)
		throws IOException
	{
		String assetAddress = GameConfig.ASSETS_EXPLODED;	
		BombRepresent represent = getBombRepresent(bomb);
		if (represent != null)
		{
			represent.getRepresent().setImage(assetAddress);
			BombThread thread = new BombThread(this, bomb);
			thread.start();
		}
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#removeBomb(mouserun.game.Bomb)
	 */
	public void removeBomb(Bomb bomb)
	{
		BombRepresent represent = getBombRepresent(bomb);
		if (represent != null)
		{
			container.remove(represent.getRepresent());
			container.remove(represent.getLabel());
		}
		
		ImagedPanel panel = mazePanels[bomb.getX()][bomb.getY()];
		container.moveToFront(panel);
		container.moveToBack(panel);
		
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#repositionMouse(mouserun.game.MouseController, mouserun.game.Grid)
	 */
	public void repositionMouse(MouseController mouse, Grid grid)
	{
		MouseRepresent thread = getMouseInstance(mouse);
		if (thread != null)
		{
			ImagedPanel mousePanel = (ImagedPanel)thread.getRepresent();
			mousePanel.setBounds(getGridLeft(grid.getX()), getGridTop(grid.getY()), GRID_LENGTH, GRID_LENGTH);	
		}
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#clearMouse()
	 */
	public void clearMouse()
	{
		for (MouseRepresent mouseThread : sequencer.getInstances())
		{
			JPanel represent = mouseThread.getRepresent();
			container.remove(represent);
		}		
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#start()
	 */
	public void start()
	{
		sequencer.start();
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#stop()
         * Modified on 01-21-2016: New mouse variables shown in the end
	 */
	public void stop()
	{	
		sequencer.kill();
		countDownThread.kill();
		
		int highestNumberOfCheese = -1;
		for (MouseRepresent mouseThread : sequencer.getInstances())
		{
			if (highestNumberOfCheese == -1)
			{
				highestNumberOfCheese = mouseThread.getMouseController().getNumberOfCheese();
			}
			else
			{
				MouseController controller = mouseThread.getMouseController();
				if (highestNumberOfCheese < controller.getNumberOfCheese())
				{
					highestNumberOfCheese = controller.getNumberOfCheese();	
				}
			}
		}
		
		ArrayList<MouseController> winners = new ArrayList<MouseController>();
		for (MouseRepresent mouseThread : sequencer.getInstances())
		{
			MouseController controller = mouseThread.getMouseController();
			if (controller.getNumberOfCheese() == highestNumberOfCheese)
			{
				winners.add(controller);
			}
		}
		
		String newline = System.getProperty("line.separator");
		String message = (winners.size() == 1 ? "Winner" : "Tie!") + newline;
		
		int index = 1;
		for (MouseController controller : winners)
		{
			message += "(" + index + ") " + controller.getMouse().getName() + newline;
			index++;
		}
		
		message += newline + newline + "Results" + newline;
		index = 1;
		for (MouseRepresent mouseThread : sequencer.getInstances())
		{
			MouseController controller = mouseThread.getMouseController();
                        // Modified: 01-21-2016
			message += "(" + index + ") " + controller.getMouse().getName() + " -- " + controller.getNumberOfCheese() + " cheese(s)" 
                                    + ", " + controller.getMouse().getSteps()+ " step(s)" 
                                    + ", " + controller.getMouse().getExploredGrids()+ " visited grid(s)" + newline;
			index++;
		}
		
		JOptionPane.showMessageDialog(null, message, "Results", JOptionPane.INFORMATION_MESSAGE);
		Debug.out().println();
		Debug.out().println();
		Debug.out().println(message);
		System.exit(0);
	}
	
	// Converts the Maze X value to the Left value of the Game Interface
	private int getGridLeft(int x)
	{
		return x * GRID_LENGTH;
	}
	
	// Converts the Maze Y value to the Top value of the Game Interface
	private int getGridTop(int y)
	{
		return (maze.getHeight() - y - 1) * GRID_LENGTH;
	}
	
	// Get the MouseInstance that represents the Mouse and the MouseController in the
	// game interface
	private MouseRepresent getMouseInstance(MouseController mouse)
	{
		for (MouseRepresent mouseThread : sequencer.getInstances())
		{
			if (mouseThread.getMouseController() == mouse)
			{
				return mouseThread;
			}
		}
		
		return null;
	}
	
	// Gets the BombRepresent that represents the bomb in the game interface.
	private BombRepresent getBombRepresent(Bomb bomb)
	{
		for (BombRepresent represent : bombs)
		{
			if (represent.getBomb() == bomb)
			{
				return represent;
			}
		}
		
		return null;
	}
	
	/*
	 * (non-Javadoc)
	 * @see mouserun.game.GameControllerAdapter#displayCountDown(int seconds)()
	 */
	public void displayCountDown(int seconds)
	{
		countDownLabel.setText(seconds + "");
		Dimension preferred = countDownLabel.getPreferredSize();
		
		int y = (int)((container.getHeight() - preferred.getHeight()) / 2);
		int x = (int)((container.getWidth() - preferred.getWidth()) / 2);
		
		countDownLabel.setBounds(x, y, (int)preferred.getWidth(), (int)preferred.getHeight());
		container.moveToFront(countDownLabel);
	}
	
}
