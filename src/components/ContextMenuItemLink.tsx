import { IonItem } from '@ionic/react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import './ContextMenuItemLink.scss';

/**
 * Renders an IonItem meant to be used in a context menu or other interactive
 * list UI, specifically one that only links to another page with no additional
 * side effects/behavior.
 */
export default function ContextMenuItemLink(props: PropsWithChildren<{ to: string }>) {
  const { children, to } = props;

  return (
    <Link to={to} className="context-menu-item-link">
      <IonItem lines="none" button={true}>
        {children}
      </IonItem>
    </Link>
  )
}
