import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';
// import { onMessageListener } from 'firebase';

interface Notification {
  id: any;
  title: any;
  body: any;
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // useEffect(() => {
  //   onMessageListener()
  //     .then((payload) => {
  //       console.log('Received foreground message: ', payload);
  //       const { title, body } = payload.notification || {};
  //       if (title && body) {
  //         const newNotification: Notification = {
  //           id: new Date().toISOString(),
  //           title,
  //           body,
  //         };
  //         setNotifications((prevNotifications) => [
  //           ...prevNotifications,
  //           newNotification,
  //         ]);
  //         new Notification(title, { body });
  //       }
  //     })
  //     .catch((err) => console.log('Failed to receive foreground message', err));
  // }, []);

  const NotificationMenu = (
    <Menu>
      {notifications.length === 0 ? (
        <Menu.Item key="no-notifications">No notifications</Menu.Item>
      ) : (
        notifications.map((notification) => (
          <Menu.Item key={notification.id}>
            <strong>{notification.title}</strong>
            <p>{notification.body}</p>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={NotificationMenu} placement="bottomRight" arrow>
      <Badge count={notifications.length} offset={[10, 0]}>
        <BellOutlined style={{ fontSize: '20px' }} />
      </Badge>
    </Dropdown>
  );
};

export default Notification;
