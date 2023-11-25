package manager

const (
	GC_INIT   = 0
	GC_READY  = 1
	GC_SET    = 2
	GC_PLAY   = 3
	GC_FINISH = 4
)

const (
	GC_DIRECT_FREE_KICK   = 4
	GC_INDIRECT_FREE_KICK = 5
	GC_PENALTY            = 6
	GC_CORNER_KICK        = 7
	GC_GOAL_KICK          = 8
	GC_THROW_IN           = 9
)

const (
	GC_STOP  = 0
	GC_START = 1
	GC_END   = 2
)

type GameController struct {
	VERSION                int
	STATE                  int
	KICKOFF                int
	SECOND_STATE           int
	SECOND_STATE_TEAM      int
	SECOND_STATE_CONDITION int
}
