// ============================================
// MESSAGE CONTROLLER
// Manages contact form messages
// ============================================

import { Request, Response } from 'express';
import Message from '../models/Message';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse';

// Create message (public - visitors can send)
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    // Create message with visitor info
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send created message
    successResponse(res, 'Message sent successfully', newMessage, 201);
  } catch (error) {
    errorResponse(res, 'Failed to send message', 500, error);
  }
};

// Get all messages (admin only)
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get total count
    const total = await Message.countDocuments(filter);

    // Find messages with pagination
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Send paginated response
    paginatedResponse(res, 'Messages fetched successfully', messages, page, limit, total);
  } catch (error) {
    errorResponse(res, 'Failed to fetch messages', 500, error);
  }
};

// Get single message (admin only)
export const getMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find message and mark as read
    const message = await Message.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    // Check if message exists
    if (!message) {
      errorResponse(res, 'Message not found', 404);
      return;
    }

    // Send message
    successResponse(res, 'Message fetched successfully', message, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch message', 500, error);
  }
};

// Update message status (admin only)
export const updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      errorResponse(res, 'Invalid status', 400);
      return;
    }

    // Find and update message status
    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // Check if message exists
    if (!message) {
      errorResponse(res, 'Message not found', 404);
      return;
    }

    // Send updated message
    successResponse(res, 'Message status updated', message, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update message status', 500, error);
  }
};

// Reply to message (admin only)
export const replyToMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    // Find and update message with reply
    const message = await Message.findByIdAndUpdate(
      id,
      {
        reply,
        status: 'replied',
        repliedAt: new Date(),
      },
      { new: true }
    );

    // Check if message exists
    if (!message) {
      errorResponse(res, 'Message not found', 404);
      return;
    }

    // Send updated message
    successResponse(res, 'Reply sent successfully', message, 200);
  } catch (error) {
    errorResponse(res, 'Failed to send reply', 500, error);
  }
};

// Delete message (admin only)
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete message
    const message = await Message.findByIdAndDelete(id);

    // Check if message exists
    if (!message) {
      errorResponse(res, 'Message not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Message deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete message', 500, error);
  }
};