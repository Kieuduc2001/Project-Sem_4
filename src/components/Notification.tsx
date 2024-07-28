import React from 'react';
import { Badge, Dropdown, Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const notifications = [
    { id: 1, message: 'New assignment posted' },
    { id: 2, message: 'Upcoming parent-teacher meeting' },
    // Add more notifications as needed
];

const NotificationMenu = () => (
    <Menu>
        {notifications.map((notification) => (
            <Menu.Item key={notification.id}>
                {notification.message}
            </Menu.Item>
        ))}
    </Menu>
);

const Notification: React.FC = () => (
    <Dropdown overlay={NotificationMenu} placement="bottomRight" arrow>
        <Badge count={notifications.length} offset={[10, 0]}>
            <BellOutlined style={{ fontSize: '20px' }} />
        </Badge>
    </Dropdown>
);

export default Notification;
