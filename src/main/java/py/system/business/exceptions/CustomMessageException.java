package py.system.business.exceptions;

public class CustomMessageException extends Exception {
	// Parameterless Constructor
	public CustomMessageException() {
	}

	// Constructor that accepts a message
	public CustomMessageException(String message) {
		super(message);
	}
}