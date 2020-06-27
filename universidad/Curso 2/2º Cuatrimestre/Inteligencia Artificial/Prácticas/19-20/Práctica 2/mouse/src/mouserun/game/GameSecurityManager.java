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
import java.io.FileDescriptor;
import java.net.InetAddress;
import java.security.Permission;
import mouserun.mouse.MouseLoader;

/*
* Class GameSecurityManager secures the game by preventing Mouse, which are implemented by third party developers, 
* from performing obscure but potentially dangerous activities.
*/
public final class GameSecurityManager
	extends SecurityManager
{
	private static GameSecurityManager current = null;
	
	// Creates a new instance of GameSecurityManager
	private GameSecurityManager()	{ }
	
	@Override 
	public void checkPermission(Permission perm)
	{
		inspectPermission(perm.getName());
	}
	
	@Override
	public void checkExit(int status)
	{
		inspectPermission("exitVM");
	}
	
	private void inspectPermission(String name)
	{
		switch (name)
		{
			case "setIO":
			case "suppressAccessChecks":
			case "createClassLoader":
			case "getClassLoader":
			case "setSecurityManager":
			case "exitVM":
			case "shutdownHooks":
			case "modifyThread":
			case "stopThread":
			case "accessDeclaredMembers":			
				denyMouse();
				break;
		}
	}
	
	// This method is to throw a SecurityException if a Mouse is in anyway
	// involve in the current stack.
	private void denyMouse()
	{
		if (isTriggeredByMouse())
		{
			throw new SecurityException();
		}
	}

	// This method determines if the Mouse is in anyway involved in the stack.
	private boolean isTriggeredByMouse()
	{
		StackTraceElement[] elements = new Throwable().getStackTrace();
		for (Class<?> mouseClass : MouseLoader.getDetectedMouseClasses())
		{
			for (StackTraceElement element : elements)
			{
				if (element.getClassName().equals(mouseClass.getCanonicalName()))
				{
					return true;
				}
			}
		}
		
		return false;
	}
	
	/*
	* Installs the GameSecurityManager to this game.
	*/
	public static GameSecurityManager install()
	{
		if (current == null)
		{
			current = new GameSecurityManager();
			if (GameConfig.INSTALL_SECURITY_MANAGER)
			{
				System.setSecurityManager(current);
			}
		}
		
		return current;
	}
		
}