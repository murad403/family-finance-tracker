import formatCurrency from "@/utils/formatCurrency";

type TBody = {
  id?: string;
  name?: string;
  relationship?: string;
  phone?: string;
  status?: string;
  joinDate?: string;
  avatar?: string;
  lifeTimeIncome?: string | number;
  lifeTimeSpend?: string | number;
  balance?: string | number;
}

type TProps = {
  thead?: string[];
  tbody?: TBody[];
}

const CustomTable = ({ thead, tbody }: TProps) => {
  return (
    <div className='p-6 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg w-full h-full'>
      <div className="overflow-x-auto">
        <table className='w-full text-left border-collapse'>
          {
            thead &&
            <thead className="border-b border-global-border">
              <tr>
                {
                  thead.map((th: string, index: number) =>
                    <th className='text-title text-sm font-medium uppercase pb-6' key={index}>
                      {th}
                    </th>
                  )
                }
              </tr>
            </thead>
          }
          {
            tbody &&
            <tbody className="divide-y divide-global-border/30 px-4">
              {
                tbody.map((td: TBody, index: number) =>
                  <tr key={index} className="hover:bg-white/20 hover:backdrop-blur-sm text-sm text-subheading">
                    {
                      (thead?.includes("profile")) &&
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xl bg-white/10 size-10 rounded-md flex items-center justify-center">
                            {td?.avatar}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-heading leading-tight">{td?.name}</h4>
                            <span className="text-xs text-description font-semibold mt-1 block">Joined: {td?.joinDate}</span>
                          </div>
                        </div>
                      </td>
                    }

                    {
                      (thead?.includes("relationship") && td?.relationship) &&
                      <td className="py-4">{td?.relationship}</td>
                    }

                    {
                      (thead?.includes("status") && td?.status) &&
                      <td className="py-4">{td?.status}</td>
                    }

                    {
                      (thead?.includes("phone") && td?.phone) &&
                      <td className="py-4">{td?.phone}</td>
                    }

                    {
                      (thead?.includes("lifetime income") && td?.lifeTimeIncome) &&
                      <td className="py-4 text-green-500 font-semibold">{formatCurrency(td?.lifeTimeIncome)}</td>
                    }

                    {
                      (thead?.includes("lifetime spend") && td?.lifeTimeSpend) &&
                      <td className="py-4 text-rose-500 font-bold">{formatCurrency(td?.lifeTimeSpend)}</td>
                    }

                    {
                      (thead?.includes("balance") && td?.balance) &&
                      <td className="py-4 text-yellow-500 font-semibold">{formatCurrency(td?.balance)}</td>
                    }

                  </tr>
                )
              }
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}

export default CustomTable