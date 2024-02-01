import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function HistoryTab() {
  const dispatch = useDispatch();
  const quote = useSelector((store) => store.quote);
  const user = useSelector((store) => store.user);
  const companyId = user.currentUser.company_id;
  // console.log('companyId: ', companyId)
  // console.log('quote: ', quote);
  useEffect(() => {
    dispatch({
      type: 'SAGA/FETCH_QUOTE_HISTORY',
      payload: companyId,
    });
  }, [dispatch, companyId]);
  return <div>History Tab</div>;
}
